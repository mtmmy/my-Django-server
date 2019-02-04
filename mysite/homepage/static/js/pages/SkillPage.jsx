import React from 'react';
import './SkillPage.scss'
import data from './../data/skill.json';

export default class SkillPage extends React.Component {

    lightenerVal(val, percentage) {
        return Math.floor((255 - val) * percentage) + val;
    }

    darkenerVal(val, percentage) {
        return Math.floor(val * percentage);
    }

    intToBase16(num) {
        let base16 = num.toString(16);
        if (base16.length == 1) {
            base16 = "0" + base16;
        }
        return base16;
    }

    hexLightener(hex, percentage) {
        if (percentage > 1) percentage = 1;
        if (percentage < 0) percentage = 0;

        var color = parseInt(hex.slice(1), 16);
        var red = Math.floor(color / 65536);
        var green = Math.floor(color / 256) % 256;
        var blue = color % 256;

        red = this.lightenerVal(red, percentage);
        green = this.lightenerVal(green, percentage);
        blue = this.lightenerVal(blue, percentage);       

        let lightColor = "#" + this.intToBase16(red) + this.intToBase16(green) + this.intToBase16(blue);
        return lightColor;
    }

    hexDarkener(hex, percentage) {
        if (percentage > 1) percentage = 1;
        if (percentage < 0) percentage = 0;
        percentage = 1 - percentage;

        var color = parseInt(hex.slice(1), 16);
        var red = Math.floor(color / 65536);
        var green = Math.floor(color / 256) % 256;
        var blue = color % 256;

        red = this.darkenerVal(red, percentage);
        green = this.darkenerVal(green, percentage);
        blue = this.darkenerVal(blue, percentage);

        let darkColor = "#" + this.intToBase16(red) + this.intToBase16(green) + this.intToBase16(blue);
        return darkColor;
    }

    createSkills(skills) {
        let container = [];
        var self = this;        
        skills.forEach(function(val, i) {
            let lightColor = self.hexLightener(val.colorCode, 0.4);
            let darkColor = self.hexDarkener(val.colorCode, 0.2);
            var style = {
                background: "linear-gradient(to right, " + lightColor + ", " + darkColor + ")"
            }
            container.push(
                <li key={i} className={`chartBar ${"barlength_" + val.percentage}`} style={style}>
                    <span className="chartLabel">
                        {val.name}
                    </span>
                </li>
            )
        })
        return container;
    }

    createCategories() {
        let container = []

        let i = 0;
        for (let key in data) {
            let dataSource = data[key];
            let cate = (
                <div key={i} className={`chart ${dataSource.className}`}>
                    <span className="chartTitle">{dataSource.nameTxt}</span>
                    <ul className="chartHorizontal">
                        {this.createSkills(dataSource.skills)}
                    </ul>
                </div>
            );
            container.push(cate);
            i++;
        }
        return container;
    }

    render() {
        return (
            <div className="skills">
                <ul className="lines">
                    <li className="line line0">
                        <span className="lineLabel title">
                            Skill level
                        </span>
                    </li>
                    <li className="line line25">
                        <span className="lineLabel">
                            Beginner
                        </span>
                    </li>
                    <li className="line line50">
                        <span className="lineLabel">
                            Skilled
                        </span>
                    </li>
                    <li className="line line75">
                        <span className="lineLabel">
                            Seasoned
                        </span>
                    </li>
                    <li className="line line100">
                        <span className="lineLabel last">
                            Advanced
                        </span>
                    </li>
                </ul>

                <div className={this.props.runAnimate ? "charts" : "chartsHide"}>
                    {this.createCategories()}
                </div>
            </div>

        );
    }
}