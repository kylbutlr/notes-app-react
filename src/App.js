import React, { Component } from 'react';
import axios from 'axios';
import '../node_modules/bulma/css/bulma.min.css';
import './css/App.css';
import { faEdit, faTrashAlt, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import swal from 'sweetalert';

import LoadingSpinner from './components/LoadingSpinner';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import SearchForm from './components/SearchForm';
import CreateNoteForm from './components/CreateNoteForm';
import CreateTagForm from './components/CreateTagForm';
import EditNoteForm from './components/EditNoteForm';
import EditTagForm from './components/EditTagForm';
import Title from './components/Title';
import Navigation from './components/Navigation';
import RegisterNotification from './components/RegisterNotification';
import SearchResults from './components/SearchResults';
import ViewNotes from './components/ViewNotes';
import ViewTags from './components/ViewTags';
import Footer from './components/Footer';

const API_ENDPOINT = 'https://kylbutlr-notes-api.herokuapp.com';
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
    this.renderTag = this.renderTag.bind(this);
    this.renderNote = this.renderNote.bind(this);
    this.renderSpinner = this.renderSpinner.bind(this);
    this.tabClick = this.tabClick.bind(this);
    this.capitalizeFirstChar = this.capitalizeFirstChar.bind(this);
    this.logoutClick = this.logoutClick.bind(this);
    this.state = {
      activeTab: tabs.LOGIN,
      loggedIn: false,
      loading: true,
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
    this.runResize();
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

  runResize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
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
    this.setState({ activeTab }, () => {
      if (activeTab === tabs.LOGIN) {
        document.getElementById('login-input').focus();
      } else if (activeTab === tabs.REGISTER) {
        document.getElementById('register-input').focus();
      } else if (activeTab === tabs.CREATE_NOTE) {
        document.getElementById('create-note-input').focus();
      } else if (activeTab === tabs.CREATE_TAG) {
        document.getElementById('create-tag-input').focus();
      } else if (activeTab === tabs.EDIT_NOTE) {
        document.getElementById('edit-note-input').focus();
      } else if (activeTab === tabs.EDIT_TAG) {
        document.getElementById('edit-tag-input').focus();
      }
    });
  }

  getSavedSession() {
    const savedSession = JSON.parse(window.localStorage.getItem('savedSession'));
    if (savedSession) {
      this.setState({ loggedIn: savedSession }, () => {
        this.getSavedData(savedSession);
        this.tabClick(tabs.VIEW_NOTES);
      });
    } else {
      this.setState({ loading: false });
    }
  }

  getSavedData(savedData) {
    this.setState({ loading: true });
    const { user_id } = savedData;
    this.getConfig(this.state.loggedIn, config => {
      axios
        .get(`${API_ENDPOINT}/tags/user/${user_id}`, config)
        .catch(err => {
          this.logoutUser('user');
          document.getElementById('login-password-input').focus();
        })
        .then(tags => {
          if (tags) {
            this.setState({ tags: tags.data }, () => {
              axios
                .get(`${API_ENDPOINT}/notes/user/${user_id}`, config)
                .catch(err => {
                  this.logoutUser('user');
                  document.getElementById('login-password-input').focus();
                })
                .then(notes => {
                  if (notes) {
                    notes = this.cleanTags(notes, cb => {
                      this.setState({ notes: cb.data });
                    });
                  }
                });
            });
          }
          this.setState({ loading: false });
        });
    });
  }

  notifyRegisterSuccessful(user) {
    swal({
      title: 'Register Successful',
      text: 'Welcome, "' + user + '"!', 
      type: 'success'
    }).then(() => {
      document.getElementById('login-password-input').focus();
    });
    /*document.getElementById('register-notification').classList.add('show');
    setTimeout(() => {
      document.getElementById('register-notification').classList.remove('show');
    }, 3000);*/
  }

  handleEditTag(id) {
    this.setState({ loading: true });
    this.getConfig(this.state.loggedIn, config => {
      axios
        .get(`${API_ENDPOINT}/tags/${id}`, config)
        .catch(err => {
          if (err.response.status === 401) {
            swal('Error', 'Session has expired. Please log in again.', 'error');
            this.logoutUser('user');
          } else {
            swal('Error', err.message, 'error');
          }
          this.setState({ loading: false });
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
                  loading: false,
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
    this.setState({ loading: true });
    this.getConfig(this.state.loggedIn, config => {
      axios
        .get(`${API_ENDPOINT}/notes/${id}`, config)
        .catch(err => {
          if (err.response.status === 401) {
            swal('Error: Session has expired. Please log in again.');
            this.logoutUser('user');
          } else {
            swal('Error: ' + err.message);
          }
          this.setState({ loading: false });
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
                  loading: false,
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
        swal({
          title: 'Are you sure?',
          text: 'The tag "' + title.toLowerCase() +
          '" has been attached to a note,\n' +
          'Are you sure you want to delete it?',
          icon: 'warning',
          buttons: true,
        })
        .then(willDelete => {
          if (willDelete) {
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
                      swal('Error', 'Session has expired. Please log in again.', 'error');
                      this.logoutUser('user');
                    } else {
                      swal('Error', err.message, 'error');
                    }
                  });
                }
              }
            }
          }
        });
      } 
      if ((needConfirm === true && confirmed === true) || needConfirm === false) {
        this.setState({ loading: true });
        axios
          .delete(`${API_ENDPOINT}/tags/${id}`, config)
          .catch(err => {
            if (err.response.status === 401) {
              swal('Error', 'Session has expired. Please log in again.', 'error');
              this.logoutUser('user');
            } else {
              swal('Error', err.message, 'error');
            }
            this.setState({ loading: false });
          })
          .then(() => {
            axios
              .get(`${API_ENDPOINT}/tags/user/${this.state.loggedIn.user_id}`, config)
              .then(tags => {
                if (tags) {
                  this.setState({
                    tags: tags.data,
                    loading: false,
                  });
                }
              });
          });
      }
    });
  }

  handleDeleteNote(id) {
    this.setState({ loading: true });
    this.getConfig(this.state.loggedIn, config => {
      axios
        .delete(`${API_ENDPOINT}/notes/${id}`, config)
        .catch(err => {
          if (err.response.status === 401) {
            swal('Error', 'Session has expired. Please log in again.', 'error');
            this.logoutUser('user');
          } else {
            swal('Error', err.message, 'error');
          }
          this.setState({ loading: false });
        })
        .then(() => {
          axios
            .get(`${API_ENDPOINT}/notes/user/${this.state.loggedIn.user_id}`, config)
            .then(notes => {
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
                this.setState({ notes: notes.data, loading: false });
              }
            });
        });
    });
  }

  handleDeleteAllTags() {
    if (this.state.tags.length > 0) {
      swal({
        title: 'Are you sure?',
        text: 'Are you sure you want to delete all (' + this.state.tags.length + ') saved tags?',
        icon: 'warning',
        buttons: true,
      })
      .then(willDelete => {
        if (willDelete) {
          this.setState({ loading: true });
          for (let i = 0; i < this.state.tags.length; i++) {
            this.handleDeleteTag(this.state.tags[i].id, this.state.tags[i].title);
          }
          this.setState({ loading: false });
        }
      });
    }
  }

  handleDeleteAllNotes() {
    if (this.state.notes.length > 0) {
      swal({
        title: 'Are you sure?',
        text: 'Are you sure you want to delete all (' + this.state.notes.length + ') saved notes?',
        icon: 'warning',
        buttons: true,
      })
      .then(willDelete => {
        if (willDelete) {
          this.setState({ loading: true });
          this.getConfig(this.state.loggedIn, config => {
            axios
              .delete(`${API_ENDPOINT}/notes/user/${this.state.loggedIn.user_id}`, config)
              .then(() => {
                this.setState({
                  notes: [],
                  loading: false,
                });
              });
          });
        }
      });
    }
  }

  resetLoginInput(user) {
    if (user) {
      if (this.state.loginInput.username) {
        this.setState({ loginInput: { username: this.state.loginInput.username, password: '' } });
      } else if (this.state.loggedIn.username) {
        this.setState({ loginInput: { username: this.state.loggedIn.username, password: '' } });
      } else {
        this.setState({ loginInput: { username: '', password: '' } });
      }
    } else {
      this.setState({ loginInput: { username: '', password: '' } });
    }
  }

  resetRegisterInput(user) {
    if (user) {
      if (this.state.registerInput.username) {
        this.setState({
          registerInput: {
            username: this.state.registerInput.username,
            password: '',
            confirmPass: '',
          },
        });
      }
    } else {
      this.setState({
        registerInput: { username: '', password: '', confirmPass: '' },
      });
    }
  }

  resetTagInput(id, title, prevTag) {
    if (id || title || prevTag) {
      this.setState({ tagInput: { id: id || '', title: title || '', prevTag: prevTag || '' } });
    } else {
      this.setState({ tagInput: { id: '', title: '', prevTag: '' } });
    }
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
          swal('Warning', 'At least one searched tag was blank.', 'warning');
          searchTags.splice(i, 1);
        } else {
          searchTags[i] = '"' + searchTags[i] + '"';
          const t = this.state.tags.findIndex(x => x.title === searchTag);
          if (t < 0) {
            swal('Error', 'The tag "' + capitalizedTag + '" does not exist.', 'error');
            searchTags.splice(i, 1);
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
    this.setState({ loading: true });
    let newTags = [this.state.tagInput.title];
    if (newTags[0].indexOf(',') >= 0) {
      newTags = newTags[0].split(',');
    }
    for (let i = 0; i < newTags.length; i++) {
      const newTag = newTags[i].trim();
      if (newTag === '') {
        swal('Error', 'New tag must not be blank.', 'error');
        this.resetTagInput();
        document.getElementById('create-tag-input').focus();
        this.setState({ loading: false });
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
                swal('Error', 'Session has expired. Please log in again.', 'error');
                this.logoutUser('user');
              } else if (err.response.status === 422) {
                swal('Error', 'The tag "' + newTags[i].title + '" already exists.', 'error');
                this.resetTagInput();
                document.getElementById('create-tag-input').focus();
              } else {
                swal('Error', err.message, 'error');
              }
              this.setState({ loading: false });
            })
            .then(res => {
              if (res) {
                this.setState(
                  {
                    tags: this.state.tags.concat({
                      title: res.data.title,
                      id: res.data.id,
                    }),
                    loading: false,
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
    this.setState({ loading: true });
    const input = this.state.noteInput;
    input.user_id = this.state.loggedIn.user_id;
    this.checkTagsInput(input.tags, tags => {
      if (tags !== false) {
        this.convertTagsToId(tags, newTags => {
            input.tags = newTags;
            if (input.tags !== false) {
              if (input.title === ' ' || input.text === ' ') {
                swal('Error', 'New note must not contain a blank title or text.', 'error');
                this.resetNoteInput();
                document.getElementById('create-note-input').focus();
                this.setState({ loading: false });
              } else {
                this.getConfig(this.state.loggedIn, config => {
                  axios
                    .post(`${API_ENDPOINT}/notes`, input, config)
                    .catch(err => {
                      if (err.response.status === 401) {
                        swal('Error', 'Session has expired. Please log in again.', 'error');
                        this.logoutUser('user');
                      } else {
                        swal('Error', err.message, 'error');
                      }
                      this.setState({ loading: false });
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
                                  loading: false,
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
            } else {
              this.setState({ loading: false });
            }
        });
      } else {
        this.setState({ loading: false });
      }
    });
  }

  onEditTagFormSubmit(e) {
    e.preventDefault();
    if (this.state.tagInput.title.indexOf(',') >= 0) {
      swal('Error', 'Multiple tags not allowed when editing a tag. Please try again.', 'error');
      this.capitalizeFirstChar(this.state.tagInput.prevTag, cb => {
        this.resetTagInput(this.state.tagInput.id, cb, this.state.tagInput.prevTag);
        this.tabClick(tabs.EDIT_TAG, () => {
          document.getElementById('edit-tag-input').focus();
        });
      });
      this.setState({ loading: false });
    } else {
      this.setState({ loading: true });
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
                  swal('Error', 'Session has expired. Please log in again.', 'error');
                  this.logoutUser('user');
                } else {
                  swal('Error', err.message, 'error');
                }
                this.setState({ loading: false });
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
              swal('Error', 'Session has expired. Please log in again.', 'error');
              this.logoutUser('user');
            } else if (err.response.status === 422) {
              swal('Error', 'The tag "' + newTag + '" already exists.', 'error');
              this.resetTagInput(
                this.state.tagInput.id,
                this.state.tagInput.title,
                this.state.tagInput.prevTag
              );
              document.getElementById('edit-tag-input');
            } else {
              swal('Error', err.message, 'error');
            }
            this.setState({ loading: false });
          })
          .then(res => {
            if (res) {
              axios
                .get(`${API_ENDPOINT}/tags/user/${this.state.loggedIn.user_id}`, config)
                .then(tags => {
                  this.setState({ tags: tags.data, loading: false }, () => {
                    this.resetTagInput();
                    this.tabClick(tabs.VIEW_TAGS);
                  });
                });
            }
          });
      });
    }
  }

  onEditNoteFormSubmit(e) {
    e.preventDefault();
    this.setState({ loading: true });
    this.getConfig(this.state.loggedIn, config => {
      const input = this.state.noteInput;
      input.user_id = this.state.loggedIn.user_id;
      if (!input.tags[0]) {
        input.tags = '';
      }
      this.checkTagsInput(input.tags, tags => {
        if (tags !== false) {
            this.convertTagsToId(tags, newTags => {
              input.tags = newTags;
              if (input.tags !== false) {
                if (input.title === ' ' || input.text === ' ') {
                  swal('Error', 'New note must not contain a blank title or text.', 'error');
                  this.resetNoteInput();
                  document.getElementById('edit-note-input').focus();
                  this.setState({ loading: false });
                } else {
                  axios
                    .put(`${API_ENDPOINT}/notes/${this.state.noteInput.id}`, input, config)
                    .catch(err => {
                      if (err.response.status === 401) {
                        swal('Error', 'Session has expired. Please log in again.', 'error');
                        this.logoutUser('user');
                      } else {
                        swal('Error', err.message, 'error');
                      }
                      this.setState({ loading: false });
                    })
                    .then(() => {
                      axios
                        .get(`${API_ENDPOINT}/notes/user/${this.state.loggedIn.user_id}`, config)
                        .then(notes => {
                          for (let i = 0; i < notes.data.length; i++) {
                            this.cleanString(notes.data[i].tags, cleanTags => {
                              this.convertIdToTags(cleanTags, convertedTags => {
                                this.parseTags(convertedTags, parsedTags => {
                                  notes.data[i].tags = parsedTags;
                                });
                              });
                            });
                          }
                          this.setState({ notes: notes.data, loading: false }, () => {
                            this.resetNoteInput();
                            this.tabClick(tabs.VIEW_NOTES);
                          });
                        });
                    });
                }
              } else {
                this.setState({ loading: false });
              }
          });
        } else {
          this.setState({ loading: false });
        }
      });
    });
  }

  onRegisterFormSubmit(e) {
    e.preventDefault();
    if (this.state.registerInput.password === this.state.registerInput.confirmPass) {
      this.setState({ loading: true });
      const newUser = {
        username: this.state.registerInput.username.toLowerCase(),
        password: this.state.registerInput.password,
      };
      axios
        .post(`${API_ENDPOINT}/register`, newUser)
        .catch(err => {
          if (err.response.status === 422) {
            swal('Error', 'Sorry, the username "' + this.state.registerInput.username + '" is not available.', 'error');
            this.resetRegisterInput();
            document.getElementById('register-input').focus();
          } else {
            swal('Error', err.message, 'error');
          }
          this.setState({ loading: false });
        })
        .then(res => {
          if (res) {
            this.tabClick(tabs.LOGIN);
            this.notifyRegisterSuccessful(newUser.username);
            this.setState({
              loginInput: {
                username: this.state.registerInput.username,
                password: '',
              },
              loading: false,
            });
          }
        });
    } else {
      swal('Error', 'Sorry, passwords did not match. Please try again.', 'error');
      this.resetRegisterInput('user');
      document.getElementById('register-password-input').focus();
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
            swal('Error', 'Sorry, invalid username/password, please try again.', 'error');
            this.resetLoginInput('user');
            document.getElementById('login-password-input').focus();
          } else {
            swal('Error', err.message, 'error');
          }
        }
        this.setState({ loading: false });
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
    swal({
      title: 'Are you sure?',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      buttons: true,
    })
    .then(willDelete => {
      if (willDelete) {
        this.logoutUser();
      }
    });
  }

  getConfig(loggedIn, cb) {
    cb({
      headers: {
        authorization: loggedIn.jwt,
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
    const length = input.length;
    for (let i = 0; i < input.length; i++) {
      const anInput = input[i].trim().toLowerCase();
      const t = this.state.tags.findIndex(x => x.title === anInput);
      if (input.length > 1 && anInput === '') {
        swal('Error', 'At least one entered tag was blank.', 'error');
        input.splice(i, 1);
      } else if (input.length > 1 && t < 0) {
        swal('Error', 'The tag "' + anInput + '" does not exist.', 'error');
        input.splice(i, 1);
      } else {
        input[i] = anInput;
      }
    }
    if (input.length === length) {
      cb(input);
    } else {
      cb(false);
    }
  }

  convertTagsToId(tags, cb) {
    const length = tags.length;
    if (tags[0].length !== 0) {
      for (let i = 0; i < tags.length; i++) {
        const anInput = tags[i];
        const t = this.state.tags.findIndex(x => x.title === anInput);
        if (t < 0) {
          swal('Error', 'The tag "' + anInput + '" does not exist', 'error');
          tags.splice(i, 1);
        } else {
          tags[i] = this.state.tags[t].id;
        }
      }
    }
    if (tags.length === length) {
      cb(tags);
    } else {
      this.setState({ loading: false });
      cb(false);
    }
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
          <p className='p2 has-text-centered has-text-dark'>{newTag}</p>
        </div>
        <div className='list-buttons'>
          <button
            className='edit-button button is-dark has-text-light'
            data-id={id}
            onClick={() => this.handleEditTag(id)}>
            <FontAwesomeIcon icon={faEdit} data-id={id} />
          </button>
          <button
            className='delete-button button is-dark has-text-light'
            data-id={id}
            onClick={() => this.handleDeleteTag(id, title)}>
            <FontAwesomeIcon icon={faTrashAlt} data-id={id} />
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
      <li key={id} className='note'>
        <div className='list-info'>
          <p className='p1 has-text-centered has-text-dark has-text-weight-semibold'>{title}</p>
          <p className='p2 has-text-centered has-text-dark'>{text}</p>
          <p className='p3 has-text-centered has-text-grey'>
            Tag(s): {tags[0] ? tags.join(', ') : 'N/A'}
          </p>
        </div>
        <div className='list-buttons'>
          <button
            className='edit-button button is-dark has-text-light'
            data-id={id}
            onClick={() => this.handleEditNote(id)}>
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            className='delete-button button is-dark has-text-light'
            data-id={id}
            onClick={() => this.handleDeleteNote(id)}>
            <FontAwesomeIcon icon={faTrashAlt} />
          </button>
        </div>
      </li>
    );
  }

  renderSpinner() {
    return (
      <div className='spinner'>
        <FontAwesomeIcon icon={faSpinner} spin />
        <h2 className='spinner-text'>Loading...</h2> 
      </div>
    );
  }

  render() {
    return (
      <div className='app'>
        <div className='header' style={{ display: this.state.loggedIn === false ? 'flex' : 'none', }}>
          <Title tabs={tabs} tabClick={this.tabClick} loggedIn={this.state.loggedIn} />
        </div>
        <div className='header hidden' style={{ display: this.state.loggedIn === false ? 'none' : 'flex', }}>
          <SearchForm
            tabs={tabs}
            activeTab={this.state.activeTab}
            onSubmit={this.onSearchFormSubmit}
            onChange={this.onSearchFormChange}
            searchInput={this.state.searchInput}
          />
          <Navigation
            tabs={tabs}
            activeTab={this.state.activeTab}
            tabClick={this.tabClick}
            searching={this.state.searching}
          />
        </div>
        <div className='body' style={{
          display: this.state.loading === true ? 'block' : 'none',
        }}>
          <LoadingSpinner
            renderSpinner={this.renderSpinner}
          />
        </div>
        <div className='body' style={{
          display: this.state.loading === false ? 'block' : 'none',
        }}>>
          <LoginForm
            tabs={tabs}
            activeTab={this.state.activeTab}
            tabClick={this.tabClick}
            onSubmit={this.onLoginFormSubmit}
            onChange={this.onLoginFormChange}
            {...this.state.loginInput}
          />
          <RegisterForm
            tabs={tabs}
            activeTab={this.state.activeTab}
            tabClick={this.tabClick}
            onSubmit={this.onRegisterFormSubmit}
            onChange={this.onRegisterFormChange}
            {...this.state.registerInput}
          />
          <RegisterNotification tabs={tabs} activeTab={this.state.activeTab} />
          <SearchResults
            tabs={tabs}
            activeTab={this.state.activeTab}
            searchResults={this.state.searchResults}
            searchedTag={this.state.searchedTag}
            searching={this.state.searching}
            renderNote={this.renderNote}
          />
          <ViewNotes
            tabs={tabs}
            activeTab={this.state.activeTab}
            searching={this.state.searching}
            notes={this.state.notes}
            renderNote={this.renderNote}
          />
          <ViewTags
            tabs={tabs}
            activeTab={this.state.activeTab}
            tags={this.state.tags}
            renderTag={this.renderTag}
          />
          <CreateNoteForm
            tabs={tabs}
            activeTab={this.state.activeTab}
            onSubmit={this.onCreateNoteFormSubmit}
            onChange={this.onNoteFormChange}
            {...this.state.noteInput}
          />
          <CreateTagForm
            tabs={tabs}
            activeTab={this.state.activeTab}
            onSubmit={this.onCreateTagFormSubmit}
            onChange={this.onTagFormChange}
            {...this.state.tagInput}
          />
          <EditNoteForm
            tabs={tabs}
            activeTab={this.state.activeTab}
            onSubmit={this.onEditNoteFormSubmit}
            onChange={this.onNoteFormChange}
            {...this.state.noteInput}
          />
          <EditTagForm
            tabs={tabs}
            activeTab={this.state.activeTab}
            onSubmit={this.onEditTagFormSubmit}
            onChange={this.onTagFormChange}
            {...this.state.tagInput}
          />
        </div>
        <div className='footer'>
          <Footer
            tabs={tabs}
            activeTab={this.state.activeTab}
            logoutClick={this.logoutClick}
            handleDeleteAllNotes={this.handleDeleteAllNotes}
            handleDeleteAllTags={this.handleDeleteAllTags}
          />
        </div>
      </div>
    );
  }
}

export default App;
