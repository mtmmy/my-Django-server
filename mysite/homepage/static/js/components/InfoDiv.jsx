import React from 'react';
import {Row, Col} from 'react-bootstrap';

class InfoDiv extends React.Component {

    createDetails(details) {
        var list = [];
        details.forEach(function(val, i) {
            list.push(<div key={i}>{val}</div>)
        })
        return list;
    }

    render() {
        var { attributes, className, type } = this.props;

        if (type == "workingExp") {
            let { companyName, dateStart, dateEnd, location, title, details } = attributes;
            return (
                <div className={className}>
                    <div className="companyName">{companyName}, {title}</div>
                    <div className="date">{dateStart} - {dateEnd}, {location}</div>
                    <div className="detail">
                        {this.createDetails(details)}
                    </div>
                </div>
            )
        } else if (type == "educationExp") {
            let { school, dateEnd, location, major, details, gpa, icon } = attributes;
            return (
                <Row className={className}>
                    <Col xs={0} sm={2} className={`icon_${icon}`}></Col>
                    <Col xs={12} sm={10}>
                        <div className="major">{major}</div>
                        <div className="school">{school}, {gpa} GPA </div>                        
                        <div className="date">{dateEnd}, {location}</div>
                        {/* <div className="detail">
                            {this.createDetails(details)}
                        </div> */}
                    </Col>
                </Row>
            )
        }
        return (
            <div className={className}>                
            </div>
        )
    }
}

export default InfoDiv;