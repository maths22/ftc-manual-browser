import React, { Component } from 'react';
import {connect} from 'react-redux';
import './App.css';
import SearchForm from './components/SearchForm';
import SearchResults from './components/SearchResults';
import {search} from './actions/api';

class App extends Component {

  state = {
    rowsPerPage: 10
  }

  fetchData = (newData = {}) => {
    return new Promise((resolve, reject) =>
      this.setState(newData, () => {
        const {query, rowsPerPage, page} = this.state;
        this.props.search({query, page, size: rowsPerPage}).then((arg) => resolve(arg))
      })
    )
  }
  
  handleChangeRowsPerPage = (rows) => {
    this.fetchData({rowsPerPage: rows})
  }

  handleChangePage = (page) => {
    this.fetchData({page})
  }

  render() {
    return (
        <div>
          <SearchForm fetchData={this.fetchData} />
          <SearchResults
            rowsPerPage={this.state.rowsPerPage}
            handleChangePage={this.handleChangePage}
            handleChangeRowsPerPage={this.handleChangeRowsPerPage} />
        </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {};
};

const mapDispatchToProps = {
  search
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
