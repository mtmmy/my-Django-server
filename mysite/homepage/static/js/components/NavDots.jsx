import React from 'react';
import { Link, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll';

class NavDots extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            viewHight: window.innerHeight,
            active: 0
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentWillMount() {
        this.setState({viewHight: window.innerHeight});
    }

    handleClick(e, i) {
        this.setState({
            active: i
        });
    }

    createDots(amount, to, offset, duration, className) {
        let container = [];

        for (let i = 0; i < amount; i++) {
            container.push(
                <Link 
                    key={i}
                    activeClass={i == this.state.active ? "active" : ""}
                    to={to + i} 
                    spy={true}
                    smooth={true} 
                    offset={-150} 
                    duration={duration} 
                    onSetActive={this.handleSetActive}
                    onClick={(e) => {
                        this.handleClick(e, i);
                    }}
                >
                    <div />
                </Link>
            );
        }
        return container;
    }

    render() {
        var { amount, to, offset, duration, className } = this.props;
        return (
            <div className={className}>
                {this.createDots(amount, to, offset, duration, className)}
            </div>
        )
    }
}

export default NavDots;