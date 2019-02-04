import React from 'react';
import './App.scss';
import NavbarComponent from './NavbarComponent.jsx';
import HomePage from './../pages/HomePage.jsx';

export default class App extends React.Component {

    render() {
        const conPref = "";
        var props = {
            items: [
                {
                    url: "/",
                    text: "HANMIN YANG",
                    component: HomePage
                }, {
                    text: "Contact",
                    subItems: [
                        {
                            text: "LinkedIn",
                            className: "fa fa-linkedin-square"
                        }, {
                            text: "Github",
                            className: "fa fa-github-square"
                        }, {
                            text: "Email",
                            className: "fa fa-envelope-square"
                        }]
                }]}

        return (
            <div style={{textAlign: 'center'}}>
                <NavbarComponent {...props} />
                <div className="contentPanel">
                    <HomePage />
                </div>
            </div>
        )
  }
}