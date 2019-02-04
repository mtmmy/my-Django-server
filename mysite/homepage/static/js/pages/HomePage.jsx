import React from 'react';
import SkillPage from './SkillPage.jsx';
import Footer from './../components/Footer.jsx';
import InfoDiv from './../components/InfoDiv.jsx';
import './HomePage.scss'
import educationData from './../data/education.json';
import workingData from './../data/working.json';
import Waypoint from 'react-waypoint';


class HomePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            skillAnimateRun: false
        }

        this.handleSkillEnter = this.handleSkillEnter.bind(this);
    }

    handleSkillEnter() {
        this.setState({ skillAnimateRun: true })
    }

    createInfoDivs(data, type, divClassName) {
        let divs = [];
        data.forEach(function (val, i) {
            var element;
            if (type == "working") {
                element = (
                    <InfoDiv key={i} attributes={val} className={divClassName} type="workingExp" />
                );
            } else if (type == "education") {
                element = (
                    <InfoDiv key={i} attributes={val} className={divClassName} type="educationExp" />
                );
            }
            divs.push(element);
        });

        return divs;
    }

    render() {
        var tempStyle = {
            textAlign: "initial",
            height: "1000px"
        }
        return (
            <div>
                <div className="banner">
                    <div>
                        <div className="helloSection">
                            <h4>Hello, I'm</h4>
                        </div>
                        <h1 className="nameSection">
                            <p>HANMIN YANG</p>
                        </h1>
                    </div>
                </div>
                <div className="bio">
                    <div className="bioBg" />
                    <div>
                        <h1 className="motto">
                            <p>Hakuna Matata</p>
                        </h1>
                        it means no worries for the rest of your days
                    </div>
                </div>
                <div className="eduDiv">
                    <div className="eduBg" />
                    <h1 className="infoHeader">
                        <p>Education</p>
                    </h1>
                    {this.createInfoDivs(educationData, "education", "eduInfoDiv")}
                </div>
                <div className="expDiv">
                    <div className="expBg" />
                    <h1 className="infoHeader">
                        <p>Professional</p>
                    </h1>
                    {this.createInfoDivs(workingData, "working", "expInfoDiv")}
                </div>
                <Waypoint onEnter={this.handleSkillEnter} bottomOffset={'10%'}>
                    <div className="skillDiv">
                        <SkillPage runAnimate={this.state.skillAnimateRun} />
                    </div>
                </Waypoint>
                <Footer />
            </div>
        );
    }
}

export default HomePage;