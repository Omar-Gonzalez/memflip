import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <p>React Memory Game</p>
                </header>
                <Board/>
            </div>
        );
    }
}

class Board extends Component {
    constructor(props) {
        super(props)

        this.state = {
            cards: [
                {number: 1, open: false, match: false}, {number: 1, open: false, match: false},
                {number: 2, open: false, match: false}, {number: 2, open: false, match: false},
                {number: 3, open: false, match: false}, {number: 3, open: false, match: false},
                {number: 4, open: false, match: false}, {number: 4, open: false, match: false},
                {number: 5, open: false, match: false}, {number: 5, open: false, match: false},
                {number: 6, open: false, match: false}, {number: 6, open: false, match: false},
                {number: 7, open: false, match: false}, {number: 7, open: false, match: false},
                {number: 8, open: false, match: false}, {number: 8, open: false, match: false},
            ],
            feedBackTxt: 'Find all matches',
            cardPicks: []
        }
    }

    componentWillMount = () => {
        this.shuffleCards()
    }

    evaluatePick = (pick) => {
        if (pick.match || pick.open){
            let msg = pick.open ? 'open!' : 'matched!'
            this.setState({
                feedBackTxt: 'Try some other card, that one is already ' + msg
            })
            return
        }

        let cards = this.state.cards
        cards[pick.index].open = true
        this.setState({
            cards: cards
        })

        let cardPicks = this.state.cardPicks
        cardPicks.push(pick)

        this.setState({
            cardPicks: cardPicks
        }, this.comparePicks)
    }

    comparePicks = () => {
        if (this.state.cardPicks.length > 1) {
            let compare = this.state.cardPicks.slice(this.state.cardPicks.length - 2, this.state.cardPicks.length)
            if (compare[0].number === compare[1].number) {
                let cards = this.state.cards
                cards[compare[0].index].match = true
                cards[compare[1].index].match = true
                this.setState({
                    feedBackTxt: "You've got a card match!",
                    cards: cards,
                    cardPicks:[]
                })
            } else {
                this.setState({
                    feedBackTxt: "Not a match, keep trying!",
                    cardPicks:[]
                }, () => {
                    setTimeout(() => {
                        let cards = this.state.cards
                        cards[compare[0].index].open = false
                        cards[compare[1].index].open = false
                        this.setState({
                            cards: cards
                        })
                    }, 1000)
                })
            }
        }
    }

    shuffleCards = () => {
        this.setState({
            cards: this.state.cards.sort(function (a, b) {
                return 0.5 - Math.random()
            })
        })
    }

    render() {
        return (
            <div>
                <div className={'score'}>
                    <p>{this.state.feedBackTxt}</p>
                </div>
                <div className={'board'}>
                    {
                        this.state.cards.map((card, index) =>
                            <Card card={card} index={index} evaluatePick={this.evaluatePick}/>
                        )
                    }
                </div>
            </div>

        )
    }
}

class Card extends Component {
    constructor(props) {
        super(props)
        this.state = {
            cardClass: props.card.open ? 'card open' : 'card closed',
            open: props.card.open,
            number: props.card.number,
            match: props.card.match,
            index: props.index,
            evaluatePick: props.evaluatePick
        }
    }

    handleClick = () => {
        let pick = {
            number: this.state.number,
            open: this.state.open,
            index: this.state.index,
            match: this.state.match,
        }
        this.state.evaluatePick(pick)
    }

    componentWillReceiveProps = (newProps) => {
        this.setState({
            cardClass: newProps.card.open ? 'card open' : 'card closed',
            open: newProps.card.open,
            match: newProps.card.match,
        })
    }

    render() {
        return (
            <div onClick={this.handleClick} className={this.state.cardClass}>
                <h1>{this.state.number}</h1>
            </div>
        )
    }
}

export default App;
