import React, { Component } from 'react';
import axios from 'axios';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import SearchForm from './SearchForm';
import CreateNoteForm from './CreateNoteForm';
import CreateTagForm from './CreateTagForm';
import EditNoteForm from './EditNoteForm';
import EditTagForm from './EditTagForm';
import './App.css';

const API_ENDPOINT = 'http://localhost:3000';
const tabs = {
  LOGIN: 1,
  REGISTER: 2,
  VIEW_NOTES: 3,
  VIEW_TAGS: 4,
  CREATE_TAG: 5,
  CREATE_NOTE: 6,
  EDIT_TAG: 7,
  EDIT_NOTE: 8,
};

class App extends Component {
  constructor(props) {
    super(props);
    this.handleEditTag = this.handleEditTag.bind(this);
    this.handleEditNote = this.handleEditNote.bind(this);
    this.handleDeleteTag = this.handleDeleteTag.bind(this);
    this.handleDeleteNote = this.handleDeleteNote.bind(this);
    this.handleDeleteAllTags = this.handleDeleteAllTags.bind(this);
    this.handleDeleteAllNotes = this.handleDeleteAllNotes.bind(this);
    this.onLoginFormSubmit = this.onLoginFormSubmit.bind(this);
    this.onRegisterFormSubmit = this.onRegisterFormSubmit.bind(this);
    this.onLoginFormChange = this.onLoginFormChange.bind(this);
    this.onRegisterFormChange = this.onRegisterFormChange.bind(this);
    this.onSearchFormChange = this.onSearchFormChange.bind(this);
    this.onTagFormChange = this.onTagFormChange.bind(this);
    this.onNoteFormChange = this.onNoteFormChange.bind(this);
    this.onSearchFormSubmit = this.onSearchFormSubmit.bind(this);
    this.onCreateTagFormSubmit = this.onCreateTagFormSubmit.bind(this);
    this.onCreateNoteFormSubmit = this.onCreateNoteFormSubmit.bind(this);
    this.onEditTagFormSubmit = this.onEditTagFormSubmit.bind(this);
    this.onEditNoteFormSubmit = this.onEditNoteFormSubmit.bind(this);
    this.state = {
      activeTab: tabs.LOGIN,
      loggedIn: false,
      searching: false,
      tags: [],
      notes: [],
      searchResults: [],
      searchedTag: [],
      searchInput: '',
      tagInput: {
        id: '',
        title: '',
        prevTag: '',
      },
      noteInput: {
        id: '',
        title: '',
        text: '',
        tags: '',
      },
      loginInput: {
        username: '',
        password: '',
      },
      registerInput: {
        username: '',
        password: '',
        confirmPass: '',
      },
    };
  }

  componentDidMount() {
    this.setState(
      {
        notes: [],
        tags: [],
      },
      () => {
        this.getSavedSession();
      }
    );
  }

  tabClick(activeTab) {
    if (activeTab === tabs.VIEW_NOTES) {
      this.resetTagInput();
      this.resetNoteInput();
      this.setState({ searching: false });
    }
    if (activeTab === tabs.LOGIN) {
      this.resetRegisterInput('user');
    }
    if (activeTab === tabs.REGISTER) {
      this.resetLoginInput('user');
    }
    this.setState({ activeTab });
  }

  getSavedSession() {
    const savedSession = JSON.parse(window.localStorage.getItem('savedSession'));
    if (savedSession) {
      this.setState({ loggedIn: savedSession }, () => {
        this.getSavedData(savedSession);
        this.tabClick(tabs.VIEW_NOTES);
      });
    }
  }

  getSavedData(savedData) {
    const { user_id } = savedData;
    this.getConfig(this.state.loggedIn, config => {
      axios
        .get(`${API_ENDPOINT}/user/${user_id}/tags`, config)
        .catch(err => {
          this.logoutUser('user');
        })
        .then(tags => {
          if (tags) {
            this.setState({ tags: this.state.tags.concat(tags.data) }, () => {
              axios
                .get(`${API_ENDPOINT}/user/${user_id}/notes`, config)
                .catch(err => {
                  this.logoutUser('user');
                })
                .then(notes => {
                  if (notes) {
                    notes = this.cleanTags(notes, cb => {
                      this.setState({ notes: this.state.notes.concat(cb.data) });
                    });
                  }
                });
            });
          }
        });
    });
  }

  handleEditTag(id) {
    this.getConfig(this.state.loggedIn, config => {
      axios
        .get(`${API_ENDPOINT}/tags/${id}`, config)
        .catch(err => {
          if (err.response.status === 401) {
            alert('Error: Session has expired, please log in again.');
            this.logoutUser('user');
          } else {
            alert('Error: ' + err.message);
          }
        })
        .then(data => {
          if (data) {
            this.capitalizeFirstChar(data.data.title, newTag => {
              this.setState(
                {
                  tagInput: {
                    id: data.data.id,
                    title: newTag,
                    prevTag: data.data.title,
                  },
                },
                () => {
                  this.tabClick(tabs.EDIT_TAG);
                }
              );
            });
          }
        });
    });
  }

  handleEditNote(id) {
    this.getConfig(this.state.loggedIn, config => {
      axios
        .get(`${API_ENDPOINT}/notes/${id}`, config)
        .catch(err => {
          if (err.response.status === 401) {
            alert('Error: Session has expired, please log in again.');
            this.logoutUser('user');
          } else {
            alert('Error: ' + err.message);
          }
        })
        .then(data => {
          if (data) {
            let tagArray = [data.data.tags];
            if (tagArray[0].indexOf(',') >= 0) {
              tagArray = tagArray[0].split(',');
            }
            for (let i = 0; i < tagArray.length; i++) {
              const newTag = tagArray[i].trim();
              // eslint-disable-next-line
              this.cleanString(newTag, cleanTag => {
                tagArray[i] = cleanTag;
              });
            }
            tagArray = tagArray.join(', ');
            this.convertIdToTags(tagArray, newTags => {
              this.setState(
                {
                  noteInput: {
                    title: data.data.title,
                    text: data.data.text,
                    tags: newTags.join(', '),
                    id: data.data.id,
                  },
                },
                () => {
                  this.tabClick(tabs.EDIT_NOTE);
                }
              );
            });
          }
        });
    });
  }

  handleDeleteTag(id, title) {
    this.getConfig(this.state.loggedIn, config => {
      const notes = this.state.notes;
      let needConfirm = false;
      let confirmed = false;
      for (let i = 0; i < notes.length; i++) {
        const tagTitle = title;
        if (notes[i].tags[0]) {
          const t = notes[i].tags.findIndex(x => x.toLowerCase() === tagTitle);
          if (t >= 0) {
            needConfirm = true;
          }
        }
      }
      if (needConfirm === true) {
        if (
          window.confirm(
            'That tag (' +
              title.toLowerCase() +
              ') has been attached to at least one note,\n' +
              'Are you sure you want to delete this tag?'
          )
        ) {
          confirmed = true;
          for (let i = 0; i < notes.length; i++) {
            const tagTitle = title;
            if (notes[i].tags[0]) {
              const t = notes[i].tags.findIndex(x => x.toLowerCase() === tagTitle);
              if (t >= 0) {
                for (let j = 0; j < notes[i].tags.length; j++) {
                  notes[i].tags[j] = notes[i].tags[j].toLowerCase();
                }
                if (notes[i].tags.length === 1) {
                  notes[i].tags[t] = '';
                } else if (notes[i].tags.length > 1) {
                  notes[i].tags.splice(t, 1);
                }
                notes[i].user_id = this.state.loggedIn.user_id;
                axios.put(`${API_ENDPOINT}/notes/${notes[i].id}`, notes[i], config).catch(err => {
                  if (err.response.status === 401) {
                    alert('Error: Session has expired, please log in again.');
                    this.logoutUser('user');
                  } else {
                    alert('Error: ' + err.message);
                  }
                });
              }
            }
          }
        }
      }
      if ((needConfirm === true && confirmed === true) || needConfirm === false) {
        axios
          .delete(`${API_ENDPOINT}/tags/${id}`, config)
          .catch(err => {
            if (err.response.status === 401) {
              alert('Error: Session has expired, please log in again.');
              this.logoutUser('user');
            } else {
              alert('Error: ' + err.message);
            }
          })
          .then(() => {
            axios
              .get(`${API_ENDPOINT}/user/${this.state.loggedIn.user_id}/tags`, config)
              .then(tags => {
                if (tags) {
                  this.setState({
                    tags: tags.data,
                  });
                }
              });
          });
      }
    });
  }

  handleDeleteNote(id) {
    this.getConfig(this.state.loggedIn, config => {
      axios
        .delete(`${API_ENDPOINT}/notes/${id}`, config)
        .catch(err => {
          if (err.response.status === 401) {
            alert('Error: Session has expired, please log in again.');
            this.logoutUser('user');
          } else {
            alert('Error: ' + err.message);
          }
        })
        .then(() => {
          axios.get(`${API_ENDPOINT}/notes`, config).then(notes => {
            if (notes) {
              for (let i = 0; i < notes.data.length; i++) {
                this.cleanString(notes.data[i].tags, cleanTags => {
                  this.convertIdToTags(cleanTags, convertedTags => {
                    this.parseTags(convertedTags, stringTags => {
                      notes.data[i].tags = stringTags;
                    });
                  });
                });
              }
              this.setState({ notes: notes.data });
            }
          });
        });
    });
  }

  handleDeleteAllTags() {
    if (this.state.tags.length > 0) {
      if (
        window.confirm(
          'Are you sure you want to delete all (' + this.state.tags.length + ') saved tags?'
        )
      ) {
        if (this.state.tags) {
          for (let i = 0; i < this.state.tags.length; i++) {
            this.handleDeleteTag(this.state.tags[i].id, this.state.tags[i].title);
          }
        }
      }
    }
  }

  handleDeleteAllNotes() {
    if (this.state.notes.length > 0) {
      if (
        window.confirm(
          'Are you sure you want to delete all (' + this.state.notes.length + ') saved notes?'
        )
      ) {
        this.getConfig(this.state.loggedIn, config => {
          axios.delete(`${API_ENDPOINT}/notes`, config).then(() => {
            this.setState({
              notes: [],
            });
          });
        });
      }
    }
  }

  resetLoginInput(user) {
    if (user) {
      if (this.state.loginInput.username) {
        this.setState({ loginInput: { username: this.state.loginInput.username, password: '' } });
      } else {
        this.setState({ loginInput: { username: this.state.loggedIn.username, password: '' } });
      }
    } else {
      this.setState({ loginInput: { username: '', password: '' } });
    }
  }

  resetRegisterInput(user) {
    if (user) {
      this.setState({
        registerInput: {
          ...this.state.registerInput,
          password: '',
          confirmPass: '',
        },
      });
    } else {
      this.setState({
        registerInput: { username: '', password: '', confirmPass: '' },
      });
    }
  }

  resetTagInput() {
    this.setState({ tagInput: { id: '', title: '', prevTag: '' } });
  }

  resetNoteInput() {
    this.setState({ noteInput: { id: '', title: '', text: '', tags: '' } });
  }

  onSearchFormChange(e) {
    this.setState({ searchInput: e.target.value });
  }

  onTagFormChange(field, e) {
    this.setState({
      tagInput: { ...this.state.tagInput, [field]: e.target.value },
    });
  }

  onNoteFormChange(field, e) {
    this.setState({
      noteInput: { ...this.state.noteInput, [field]: e.target.value },
    });
  }

  onLoginFormChange(field, e) {
    this.setState({
      loginInput: { ...this.state.loginInput, [field]: e.target.value },
    });
  }

  onRegisterFormChange(field, e) {
    this.setState({
      registerInput: { ...this.state.registerInput, [field]: e.target.value },
    });
  }

  onSearchFormSubmit(e) {
    e.preventDefault();
    let searchTags = [this.state.searchInput.toLowerCase()];
    let searchResults = [];
    if (searchTags[0].indexOf(',') >= 0) {
      searchTags = searchTags[0].split(',');
    }
    for (let i = 0; i < searchTags.length; i++) {
      const searchTag = searchTags[i].trim();
      this.capitalizeFirstChar(searchTag, capitalizedTag => {
        searchTags[i] = capitalizedTag;
        if (searchTag === '') {
          alert('At least one searched tag was blank.');
        } else {
          searchTags[i] = '"' + searchTags[i] + '"';
          const t = this.state.tags.findIndex(x => x.title === searchTag);
          if (t < 0) {
            alert('Error: Tag (' + searchTag + ') does not exist.');
          } else {
            for (let j = 0; j < this.state.notes.length; j++) {
              this.cleanString(this.state.notes[j].tags, cleanTags => {
                const note = this.state.notes[j];
                if (cleanTags.indexOf(',') >= 0) {
                  cleanTags = cleanTags.split(',');
                }
                for (let k = 0; k < cleanTags.length; k++) {
                  if (cleanTags[k]) {
                    cleanTags[k] = cleanTags[k].trim();
                    if (cleanTags[k].toLowerCase() === searchTag) {
                      if (searchResults.findIndex(x => x === note) === -1) {
                        searchResults.push(note);
                      }
                    }
                  }
                }
              });
            }
            if (this.state.activeTab !== tabs.VIEW_NOTES) {
              this.tabClick(tabs.VIEW_NOTES);
            }
            this.setState({
              searchResults: searchResults,
              searchedTag: searchTags,
              searchInput: '',
              searching: true,
            });
          }
        }
      });
    }
  }

  onCreateTagFormSubmit(e) {
    e.preventDefault();
    let newTags = [this.state.tagInput.title];
    if (newTags[0].indexOf(',') >= 0) {
      newTags = newTags[0].split(',');
    }
    for (let i = 0; i < newTags.length; i++) {
      const newTag = newTags[i].trim();
      if (newTag === '') {
        alert('New tag must not be blank.');
      } else {
        newTags[i] = {
          title: newTag.toLowerCase(),
          user_id: this.state.loggedIn.user_id,
        };
        this.getConfig(this.state.loggedIn, config => {
          axios
            .post(`${API_ENDPOINT}/tags`, newTags[i], config)
            .catch(err => {
              if (err.response.status === 401) {
                alert('Error: Session has expired, please log in again.');
                this.logoutUser('user');
              } else if (err.response.status === 422) {
                alert('Error: Tag (' + newTags[i].title + ') already exists.');
              } else {
                alert('Error: ' + err.message);
              }
            })
            .then(res => {
              if (res) {
                this.setState(
                  {
                    tags: this.state.tags.concat({
                      title: res.data.title,
                      id: res.data.id,
                    }),
                  },
                  () => {
                    this.resetTagInput();
                    this.tabClick(tabs.VIEW_TAGS);
                  }
                );
              }
            });
        });
      }
    }
  }

  onCreateNoteFormSubmit(e) {
    e.preventDefault();
    const input = this.state.noteInput;
    input.user_id = this.state.loggedIn.user_id;
    this.checkTagsInput(input.tags, tags => {
      this.convertTagsToId(tags, newTags => {
        input.tags = newTags;
        if (input.tags !== false) {
          if (input.title === ' ' || input.text === ' ') {
            alert('New note must not contain a blank title or text.');
            this.resetNoteInput();
          } else {
            this.getConfig(this.state.loggedIn, config => {
              axios
                .post(`${API_ENDPOINT}/notes`, input, config)
                .catch(err => {
                  if (err.response.status === 401) {
                    alert('Error: Session has expired, please log in again.');
                    this.logoutUser('user');
                  } else {
                    alert('Error: ' + err.message);
                  }
                })
                .then(res => {
                  if (res) {
                    this.cleanString(res.data.tags, cleanTags => {
                      this.convertIdToTags(cleanTags, convertedTags => {
                        this.parseTags(convertedTags, parsedTags => {
                          const newNote = {
                            title: res.data.title,
                            text: res.data.text,
                            tags: parsedTags,
                            id: res.data.id,
                          };
                          this.setState(
                            {
                              noteInput: newNote,
                              notes: this.state.notes.concat(newNote),
                            },
                            () => {
                              this.resetNoteInput();
                              this.tabClick(tabs.VIEW_NOTES);
                            }
                          );
                        });
                      });
                    });
                  }
                });
            });
          }
        }
      });
    });
  }

  onEditTagFormSubmit(e) {
    e.preventDefault();
    this.getConfig(this.state.loggedIn, config => {
      const newTag = this.state.tagInput.title.toLowerCase();
      const prevTag = this.state.tagInput.prevTag;
      const notes = this.state.notes;
      for (let i = 0; i < notes.length; i++) {
        if (notes[i].tags[0]) {
          const t = notes[i].tags.findIndex(x => x.toLowerCase() === prevTag);
          if (t >= 0) {
            notes[i].tags[t] = newTag;
            notes[i].user_id = this.state.loggedIn.user_id;
            axios.put(`${API_ENDPOINT}/notes/${notes[i].id}`, notes[i], config).catch(err => {
              if (err.response.status === 401) {
                alert('Error: Session has expired, please log in again.');
                this.logoutUser('user');
              } else {
                alert('Error: ' + err.message);
              }
            });
          }
        }
      }
      const updatedTag = {
        title: newTag,
        user_id: this.state.loggedIn.user_id,
      };
      axios
        .put(`${API_ENDPOINT}/tags/${this.state.tagInput.id}`, updatedTag, config)
        .catch(err => {
          if (err.response.status === 401) {
            alert('Error: Session has expired, please log in again.');
            this.logoutUser('user');
          } else if (err.response.status === 422) {
            alert('Error: Tag (' + newTag + ') already exists.');
          } else {
            alert('Error: ' + err.message);
          }
        })
        .then(res => {
          if (res) {
            axios
              .get(`${API_ENDPOINT}/user/${this.state.loggedIn.user_id}/tags`, config)
              .then(tags => {
                this.setState({ tags: tags.data }, () => {
                  this.resetTagInput();
                  this.tabClick(tabs.VIEW_TAGS);
                });
              });
          }
        });
    });
  }

  onEditNoteFormSubmit(e) {
    e.preventDefault();
    this.getConfig(this.state.loggedIn, config => {
      const input = this.state.noteInput;
      input.user_id = this.state.loggedIn.user_id;
      if (!input.tags[0]) {
        input.tags = '';
      }
      this.checkTagsInput(input.tags, tags => {
        this.convertTagsToId(tags, newTags => {
          input.tags = newTags;
          if (input.tags !== false) {
            if (input.title === ' ' || input.text === ' ') {
              alert('New note must not contain a blank title or text.');
              this.resetNoteInput();
            } else {
              axios
                .put(`${API_ENDPOINT}/notes/${this.state.noteInput.id}`, input, config)
                .catch(err => {
                  if (err.response.status === 401) {
                    alert('Error: Session has expired, please log in again.');
                    this.logoutUser('user');
                  } else {
                    alert('Error: ' + err.message);
                  }
                })
                .then(() => {
                  axios.get(`${API_ENDPOINT}/notes`, config).then(notes => {
                    for (let i = 0; i < notes.data.length; i++) {
                      this.cleanString(notes.data[i].tags, cleanTags => {
                        this.convertIdToTags(cleanTags, convertedTags => {
                          this.parseTags(convertedTags, parsedTags => {
                            notes.data[i].tags = parsedTags;
                          });
                        });
                      });
                    }
                    this.setState({ notes: notes.data }, () => {
                      this.resetNoteInput();
                      this.tabClick(tabs.VIEW_NOTES);
                    });
                  });
                });
            }
          }
        });
      });
    });
  }

  onRegisterFormSubmit(e) {
    e.preventDefault();
    if (this.state.registerInput.password === this.state.registerInput.confirmPass) {
      const newUser = {
        username: this.state.registerInput.username.toLowerCase(),
        password: this.state.registerInput.password,
      };
      axios
        .post(`${API_ENDPOINT}/register`, newUser)
        .catch(err => {
          if (err.response.status === 422) {
            alert('Error: Username (' + this.state.registerInput.username + ') already exists.');
            this.resetRegisterInput('user');
          } else {
            alert('Error: ' + err.message);
          }
        })
        .then(res => {
          if (res) {
            this.tabClick(tabs.LOGIN);
          }
        });
    } else {
      alert('Passwords did not match.');
      this.resetRegisterInput();
    }
  }

  onLoginFormSubmit(e) {
    e.preventDefault();
    const newUser = {
      username: this.state.loginInput.username.toLowerCase(),
      password: this.state.loginInput.password,
      user_id: null,
    };
    axios
      .post(`${API_ENDPOINT}/login`, newUser)
      .catch(err => {
        if (err) {
          if (err.response.status === 404) {
            alert('Error: Invalid username/password, please try again.');
          } else {
            alert('Error: ' + err.message);
          }
        }
      })
      .then(user => {
        if (user) {
          this.setState({ loggedIn: user.data }, () => {
            this.getSavedData(user.data);
            this.tabClick(tabs.VIEW_NOTES);
            window.localStorage.setItem('savedSession', JSON.stringify(user.data));
          });
        }
      });
  }

  logoutUser(user) {
    if (user) {
      this.resetLoginInput('user');
    } else {
      this.resetLoginInput();
    }
    this.tabClick(tabs.LOGIN);
    this.resetTagInput();
    this.resetNoteInput();
    this.setState({
      loggedIn: false,
      searching: false,
      tags: [],
      notes: [],
      searchResults: [],
      searchedTag: [],
      searchInput: '',
    });
    const localStorage = JSON.parse(window.localStorage.getItem('savedSession'));
    localStorage.jwt = '';
    window.localStorage.setItem('savedSession', JSON.stringify(localStorage));
  }

  logoutClick() {
    if (window.confirm('Are you sure you want to logout?')) {
      this.logoutUser();
    }
  }

  getConfig(loggedIn, cb) {
    cb({
      headers: {
        authorization: loggedIn.jwt,
        user_id: loggedIn.user_id,
      },
    });
  }

  capitalizeFirstChar(string, cb) {
    if (string) {
      const newString = string.substring(0, 1).toUpperCase() + string.substring(1);
      cb(newString);
    } else {
      cb(string);
    }
  }

  cleanTags(notes, cb) {
    for (let i = 0; i < notes.data.length; i++) {
      this.cleanString(notes.data[i].tags, tagArray => {
        tagArray = tagArray.split(',');
        for (let j = 0; j < tagArray.length; j++) {
          tagArray[j] = tagArray[j].trim();
          this.convertIdToTags(tagArray[j], newTag => {
            tagArray[j] = newTag[0];
          });
        }
        this.parseTags(tagArray, newTags => {
          notes.data[i].tags = newTags;
        });
      });
    }
    cb(notes);
  }

  checkTagsInput(data, cb) {
    let input = [data];
    if (input[0].indexOf(',') >= 0) {
      input = input[0].split(',');
    }
    for (let i = 0; i < input.length; i++) {
      const anInput = input[i].trim().toLowerCase();
      const t = this.state.tags.findIndex(x => x.title === anInput);
      if (input.length > 1 && anInput === '') {
        alert('Error: At least one entered tag was blank.');
        input = false;
      } else if (input.length > 1 && t < 0) {
        alert('Error: Tag (' + anInput + ') does not exist.');
        input = false;
      } else {
        input[i] = anInput;
      }
    }
    cb(input);
  }

  convertTagsToId(tags, cb) {
    if (tags[0].length !== 0) {
      for (let i = 0; i < tags.length; i++) {
        const anInput = tags[i];
        const t = this.state.tags.findIndex(x => x.title === anInput);
        if (t < 0) {
          alert('Error: Tag (' + anInput + ') does not exist');
          cb(false);
        } else {
          tags[i] = this.state.tags[t].id;
        }
      }
    }
    cb(tags);
  }

  convertIdToTags(anId, cb) {
    if (anId) {
      let id = anId;
      if (id.indexOf(',') >= 0) {
        id = id.split(',');
        for (let i = 0; i < id.length; i++) {
          id[i] = id[i].trim();
        }
      } else {
        id = [id.trim()];
      }
      const length = id.length;
      for (let i = 0; i < length; i++) {
        const newId = id[i];
        const t = this.state.tags.findIndex(x => x.id === Number(newId));
        if (t >= 0) {
          const newTag = this.state.tags[t].title;
          id[i] = newTag;
        }
      }
      cb(id);
    } else {
      cb([null]);
    }
  }

  cleanString(string, cb) {
    if (string) {
      if (string.indexOf('{') >= 0 || string.indexOf('}') >= 0) {
        string = string.replace(/{|}/g, '');
      }
      if (string.indexOf('[') >= 0 || string.indexOf(']') >= 0) {
        string = string.replace(/\[|]/g, '');
      }
      if (string.indexOf('"') >= 0 || string.indexOf(`'`) >= 0) {
        string = string.replace(/"|'/g, '');
      }
      if (string.indexOf(',') >= 0) {
        string = string.replace(/,/g, ', ');
      }
    }
    cb(string);
  }

  parseTags(tags, cb) {
    if (tags) {
      let tagArray = tags;
      for (let i = 0; i < tagArray.length; i++) {
        if (tagArray[i]) {
          const newTag = tagArray[i].trim();
          this.cleanString(newTag, cleanTag => {
            tagArray[i] = cleanTag;
          });
        }
      }
      cb(tagArray);
    } else cb(['']);
  }

  renderTag(tagData) {
    const { id, title } = tagData;
    const newTag = title.substring(0, 1).toUpperCase() + title.substring(1);
    return (
      <li key={id}>
        <div className='list-info'>
          <p className='p2'>{newTag}</p>
        </div>
        <div className='list-buttons'>
          <button className='edit-button' data-id={id} onClick={() => this.handleEditTag(id)}>
            Edit
          </button>
          <button
            className='delete-button'
            data-id={id}
            onClick={() => this.handleDeleteTag(id, title)}>
            [ X ]
          </button>
        </div>
      </li>
    );
  }

  renderNote(noteData) {
    const { id, title, text, tags } = noteData;
    if (tags[0]) {
      for (let i = 0; i < tags.length; i++) {
        this.capitalizeFirstChar(tags[i], newTag => {
          tags[i] = newTag;
        });
      }
    }
    return (
      <li key={id}>
        <div className='list-info'>
          <p className='p1'>{title}</p>
          <p className='p2'>{text}</p>
          <p className='p3'>Tag(s): {tags[0] ? tags.join(', ') : 'N/A'}</p>
        </div>
        <div className='list-buttons'>
          <button className='edit-button' data-id={id} onClick={() => this.handleEditNote(id)}>
            Edit
          </button>
          <button className='delete-button' data-id={id} onClick={() => this.handleDeleteNote(id)}>
            [ X ]
          </button>
        </div>
      </li>
    );
  }

  render() {
    return (
      <div className='app'>
        {/* Header */}
        <div className='header'>
          {/* Title */}
          <div className='title'>
            <div
              style={{
                display: this.state.loggedIn !== false ? 'block' : 'none',
              }}>
              <h1 onClick={() => this.tabClick(tabs.VIEW_NOTES)}>My Notes</h1>
            </div>
            <div
              style={{
                display: this.state.loggedIn === false ? 'block' : 'none',
              }}>
              <h1 onClick={() => this.tabClick(tabs.LOGIN)}>My Notes</h1>
            </div>
          </div>

          {/* Search Form */}
          <div
            className='search'
            style={{
              display:
                this.state.activeTab !== tabs.LOGIN && this.state.activeTab !== tabs.REGISTER
                  ? 'block'
                  : 'none',
            }}>
            <SearchForm
              onSubmit={this.onSearchFormSubmit}
              onChange={this.onSearchFormChange}
              searchInput={this.state.searchInput}
            />
          </div>

          {/* Navigation Buttons */}
          <div className='navigation'>
            <button
              id='tabsVIEW_NOTES'
              style={{
                display:
                  (this.state.activeTab !== tabs.LOGIN &&
                    this.state.activeTab !== tabs.REGISTER &&
                    this.state.activeTab !== tabs.VIEW_NOTES) ||
                  this.state.searching === true
                    ? 'block'
                    : 'none',
              }}
              onClick={() => this.tabClick(tabs.VIEW_NOTES)}>
              Back to Notes
            </button>
            <button
              id='tabsCREATE_NOTE'
              style={{
                display:
                  this.state.activeTab === tabs.VIEW_NOTES && this.state.searching === false
                    ? 'block'
                    : 'none',
              }}
              onClick={() => this.tabClick(tabs.CREATE_NOTE)}>
              Create Note
            </button>
            <button
              id='tabsVIEW_TAGS'
              style={{
                display:
                  this.state.activeTab === tabs.VIEW_NOTES ||
                  this.state.activeTab === tabs.CREATE_NOTE ||
                  this.state.activeTab === tabs.CREATE_TAG
                    ? 'block'
                    : 'none',
              }}
              onClick={() => this.tabClick(tabs.VIEW_TAGS)}>
              View Tags
            </button>
            <button
              id='tabsCREATE_TAG'
              style={{
                display: this.state.activeTab === tabs.VIEW_TAGS ? 'block' : 'none',
              }}
              onClick={() => this.tabClick(tabs.CREATE_TAG)}>
              Create Tag
            </button>
            <div
              className='invisible-delete-button'
              style={{
                display:
                  this.state.activeTab === tabs.EDIT_NOTE || this.state.activeTab === tabs.EDIT_TAG
                    ? 'flex'
                    : 'none',
              }}
            />
          </div>
        </div>

        {/* Body */}
        <div className='body'>
          {/* Login Form */}
          <div
            className='login'
            style={{
              display: this.state.activeTab === tabs.LOGIN ? 'block' : 'none',
            }}>
            <h2>Login:</h2>
            <LoginForm
              onSubmit={this.onLoginFormSubmit}
              onChange={this.onLoginFormChange}
              {...this.state.loginInput}
            />
            <div className='or'>or</div>
            <button onClick={() => this.tabClick(tabs.REGISTER)}>Register</button>
          </div>

          {/* Register Form */}
          <div
            className='register'
            style={{
              display: this.state.activeTab === tabs.REGISTER ? 'block' : 'none',
            }}>
            <h2>Register:</h2>
            <RegisterForm
              onSubmit={this.onRegisterFormSubmit}
              onChange={this.onRegisterFormChange}
              {...this.state.registerInput}
            />
            <button onClick={() => this.tabClick(tabs.LOGIN)}>Back to Login</button>
          </div>

          {/* Search Results */}
          <div
            className='view-search'
            style={{
              display:
                this.state.activeTab === tabs.VIEW_NOTES && this.state.searching === true
                  ? 'block'
                  : 'none',
            }}>
            <h2>Search Results:</h2>
            <h3>
              {this.state.searchResults.length} found for {this.state.searchedTag.join(', ')}:
            </h3>
            <h4
              style={{
                display: this.state.searchResults.length === 0 ? 'block' : 'none',
              }}>
              No Results Found
            </h4>
            <ol>{this.state.searchResults.map(n => this.renderNote(n))}</ol>
          </div>

          {/* View Notes */}
          <div
            className='view-notes'
            style={{
              display:
                this.state.activeTab === tabs.VIEW_NOTES && this.state.searching === false
                  ? 'block'
                  : 'none',
            }}>
            <h2>Notes:</h2>
            <ol
              style={{
                display: this.state.notes.length === 0 ? 'block' : 'none',
              }}>
              <li>
                <div className='list-info'>
                  <h4>No notes currently exist.</h4>
                  <h4>Try creating a new note above!</h4>
                </div>
              </li>
            </ol>
            <ol>{this.state.notes.map(n => this.renderNote(n))}</ol>
          </div>

          {/* View Tags */}
          <div
            className='view-tags'
            style={{
              display: this.state.activeTab === tabs.VIEW_TAGS ? 'block' : 'none',
            }}>
            <h2>Tags:</h2>
            <ol
              style={{
                display: this.state.tags.length === 0 ? 'block' : 'none',
              }}>
              <li>
                <div className='list-info'>
                  <h4>No tags currently exist.</h4>
                  <h4>Try creating a new tag above!</h4>
                </div>
              </li>
            </ol>
            <ol>{this.state.tags.map(n => this.renderTag(n))}</ol>
          </div>

          {/* Create Note Form */}
          <div
            className='create-note'
            style={{
              display: this.state.activeTab === tabs.CREATE_NOTE ? 'block' : 'none',
            }}>
            <h2>Create Note:</h2>
            <CreateNoteForm
              onSubmit={this.onCreateNoteFormSubmit}
              onChange={this.onNoteFormChange}
              {...this.state.noteInput}
            />
          </div>

          {/* Create Tag Form */}
          <div
            className='create-tag'
            style={{
              display: this.state.activeTab === tabs.CREATE_TAG ? 'block' : 'none',
            }}>
            <h2>Create Tag(s):</h2>
            <CreateTagForm
              onSubmit={this.onCreateTagFormSubmit}
              onChange={this.onTagFormChange}
              {...this.state.tagInput}
            />
          </div>

          {/* Edit Note Form */}
          <div
            className='edit-note'
            style={{
              display: this.state.activeTab === tabs.EDIT_NOTE ? 'block' : 'none',
            }}>
            <h2>Edit Note:</h2>
            <EditNoteForm
              onSubmit={this.onEditNoteFormSubmit}
              onChange={this.onNoteFormChange}
              {...this.state.noteInput}
            />
          </div>

          {/* Edit Tag Form */}
          <div
            className='edit-tag'
            style={{
              display: this.state.activeTab === tabs.EDIT_TAG ? 'block' : 'none',
            }}>
            <h2>Edit Tag:</h2>
            <EditTagForm
              onSubmit={this.onEditTagFormSubmit}
              onChange={this.onTagFormChange}
              {...this.state.tagInput}
            />
          </div>
        </div>

        {/* Footer */}
        <div className='footer'>
          {/* Footer Buttons */}
          <div className='footer-buttons'>
            <div
              className='delete-notes-button'
              style={{ display: this.state.activeTab === tabs.VIEW_NOTES ? 'flex' : 'none' }}>
              <button onClick={this.handleDeleteAllNotes}>Delete All Notes</button>
            </div>
            <div
              className='delete-tags-button'
              style={{ display: this.state.activeTab === tabs.VIEW_TAGS ? 'flex' : 'none' }}>
              <button onClick={this.handleDeleteAllTags}>Delete All Tags</button>
            </div>
            <div
              className='invisible-delete-button'
              style={{
                display:
                  this.state.activeTab !== tabs.VIEW_NOTES &&
                  this.state.activeTab !== tabs.VIEW_TAGS
                    ? 'flex'
                    : 'none',
              }}
            />
            <div
              className='logout-button'
              style={{
                display:
                  this.state.activeTab !== tabs.LOGIN && this.state.activeTab !== tabs.REGISTER
                    ? 'flex'
                    : 'none',
              }}>
              <button onClick={() => this.logoutClick()}>Logout</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
