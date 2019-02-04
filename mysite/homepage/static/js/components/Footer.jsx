import React from 'react';
import { Row } from 'react-bootstrap';
import './Footer.scss';

export default class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.onIconClick = this.onIconClick.bind(this);
    }

    onDownloadClick() {
        window.open("https://drive.google.com/file/d/1p9iCSYJXsK6BaD-BFr2duxzrsoYAAyzL/view?usp=sharing")        
    }

    onIconClick(site) {
        switch (site) {
            case "linkedin":
                window.open("https://www.linkedin.com/in/yanghanmin/", "_blank");
                break;
            case "facebook":
                window.open("https://www.facebook.com/mtmmy", "_blank");
                break;
            case "github":
                window.open("https://github.com/mtmmy", "_blank");
                break;
            case "twitter":
                window.open("https://twitter.com/han_min_yang", "_blank");
                break;
            default:
        }
    }

    render() {
        return (
            <div className="footer">
                <div className="downloadResume" onClick={this.onDownloadClick}>Download My Resume</div>
                <div className="iconContainer">
                    <div className="icons fa fa-linkedin-square" onClick={() => this.onIconClick("linkedin")} />
                    {/* <div className="icons fa fa-facebook-square" onClick={() => this.onIconClick("facebook")} /> */}
                    <div className="icons fa fa-github-square" onClick={() => this.onIconClick("github")} />
                    {/* <div className="icons fa fa-twitter-square" onClick={() => this.onIconClick("twitter")} /> */}
                    <a className="icons fa fa-envelope-square" href="mailto:hyang173@asu.edu" />
                </div>
            </div>
        )
    }
}