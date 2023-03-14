import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todoList: [],
      activeItem: {
        id: null,
        title: '',
        completed: false,
      },
      editing: false,
    }
    this.fetchTasks = this.fetchTasks.bind(this)

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getCookie = this.getCookie.bind(this)


    this.startEdit = this.startEdit.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    // this.strikeUnstrike = this.strikeUnstrike.bind(this)
  };
  getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      var cookies = document.cookie.split(';');
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  componentWillMount() {
    this.fetchTasks()
  }
  fetchTasks() {
    // console.log('Fetching...')

    fetch('http://127.0.0.1:8000/api/task-list/')
      .then(response => response.json())
      .then(data =>
        this.setState({
          todoList: data
        })
      )
  }
  handleChange(e) {
    // var name = e.target.name
    var value = e.target.value
    this.setState({
      activeItem: {
        ...this.state.activeItem,
        title: value
      }
    })
  }
  handleSubmit(e) {
    e.preventDefault()
    console.log('ITEM:', this.state.activeItem)

    var csrftoken = this.getCookie('csrftoken')

    var url = 'http://127.0.0.1:8000/api/task-create/'

    if (this.state.editing === true) {
      url = `http://127.0.0.1:8000/api/task-update/${this.state.activeItem.id}/`
      this.setState({
        editing: false
      })
    }
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
      body: JSON.stringify(this.state.activeItem)
    }).then((response) => {
      this.fetchTasks()
      this.setState({
        activeItem: {
          id: null,
          title: '',
          completed: false,
        }
      })
    }).catch(function (error) {
      console.log('ERROR:', error)
    })

  }
  startEdit(task) {
    this.setState({
      activeItem: task,
      editing: true,
    })
  }
  deleteItem(task) {
    var csrftoken = this.getCookie('csrftoken')

    fetch(`http://127.0.0.1:8000/api/task-delete/${task.id}/`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        'X-CSRFToken': csrftoken,
      },
    }).then((response) => {

      this.fetchTasks()
    })
  }

  render() {
    var tasks = this.state.todoList
    var self = this
    return (
      <div className="App">
        <div className="toDoMain">
          <h1 className="ToDoHeading-container">ToDo List</h1>
          <form id="form" onSubmit={this.handleSubmit}  >
            <div className="inputDiv">
              <input onChange={this.handleChange} type="text" value={this.state.activeItem.title} className="addItemsBar" placeholder="Add Items" id="title" name="title" />
              <div className="addSymbol1" >
                <input id="submit" className="addSymbol" type="submit" name="Add" />
              </div>

            </div>
          </form>

          <div className="taskList1">
            {tasks.map(function (task, index) {
              return (
                <div key={index} className="taskList">
                  <div className="taskDescription">
                    {task.title}
                  </div>
                  <div className="editButton" onClick={() => self.startEdit(task)} >
                    <img className="editSymbol" src="../Assets/copy-writing.svg" alt="" />
                  </div>
                  <div className="deleteButton" onClick={() => self.deleteItem(task)}>
                    <img className="deleteSymbol" src="../Assets/delete.svg" alt="" />
                  </div>
                </div>
              )
            })}

          </div>
        </div>
      </div>
    );
  }
}

export default App;
