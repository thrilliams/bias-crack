import React from 'react';
import ReactDOM from 'react-dom';
import './main.scss';
import { /*newsapi, */particles } from './config.json';
import { articles } from './articleCache.json';
import Particles from 'react-particles-js';
import * as imgerr from './img/404.png';
import navbar from './img/navbar.svg';

import homedata from './home.json';
const possibleTags = [['authority', 'liberty'], ['nation', 'world'], ['progress', 'tradition'], ['equality', 'market']];

function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomTags() {
    return possibleTags.map(e => randomElement(e));
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = { page: 'home' };
    }

    setPage(page) {
        this.setState({ ...this.state, page: page });
    }

    setPageHome() {
        this.setPage('home');
    }

    setPageFeed() {
        this.setPage('feed');
    }

    render() {
        return (<>
            <nav>
                <img src={navbar} alt="Bias Crack" className="clickable" onClick={this.setPageHome.bind(this)}></img>
                <span className="grow"></span>
                <p className="clickable" onClick={this.setPageHome.bind(this)}>Home</p>
                <p className="clickable" onClick={this.setPageFeed.bind(this)}>Feed</p>
            </nav>
            {{
                home: <Home />,
                feed: <ArticleContainer />
            }[this.state.page]}
            <Particles params={particles} />
        </>);
    }
}

function Home() {
    return (<div className="content">
        <div className="blurb">
            <h3 className="blurb-title">Bias Crack</h3>
            <p>One of the biggest challenges faced by the average knowledge-seeker is that the media of today has the glaring issue of a self propagating cycle of extremist exponentiation. That is, since news sites use algorithms to determine your views and feed you standpoints that you already agree with, it encourages readers to be pushed towards the extreme ends of whatever political leaning they may be (however slightly) inclined towards. Political extremism tends to have the issue of forming echo chambers, circles of confirmation that are exceptionally resistant to outside ideas that don’t fit with their orthodox.</p>
            <p>The solution? Expose cognizant readers to dissent to allow for a more open mind and the ability to see the validity in arguments of those that they don’t necessarily agree with. Bias Crack takes note of your political and ideological leanings and intentionally showing the viewer a mix of views they agree with as well as those that provide dissent for a healthy balanced diet of ideas.</p>
        </div>
        <div id="jumbotron">
            {[...homedata].map((e, i) => <Card key={i} entry={e} />)}
        </div>
        {[...homedata].map((e, i) => <Description key={i} entry={e} />)}
    </div>);
}

function Card(props) {
    let name = [props.entry.name.slice(0, props.entry.name.indexOf(' ')), props.entry.name.slice(props.entry.name.indexOf(' ') + 1)]
    console.log(name)
    return (<div className="card">
        <img className="card-icon" src={`${process.env.PUBLIC_URL}/icons/${props.entry.icon}.svg`} alt={props.entry.icon} title={props.entry.icon} />
        <div className="card-title">{name[0]}<br />{name[1]}</div>
        <button className="card-btn clickable" onClick={_ => document.querySelector(`#${props.entry.id}`).scrollIntoView({ behavior: 'smooth' })}>Learn More</button>
    </div>);
}

function Description(props) {
    let body = props.entry.body.split('\n');
    if (body.length > 1) {
        body = body.reduce((previous, current) => <>{previous}<p>{current}</p></>, <></>);
    } else {
        body = <p>{body[0]}</p>;
    }

    return (<div className="blurb" id={props.entry.id}>
        <img className="blurb-icon" src={`${process.env.PUBLIC_URL}/icons/${props.entry.icon}.svg`} alt={props.entry.icon} title={props.entry.icon} />
        <h3 className="blurb-title">{props.entry.name}</h3>
        {body}
    </div>);
}

class ArticleContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { articles: articles };
    }

    render() {
        if (this.state.articles.length > 0) {
            return (<div id="article-container" className="content">
                {this.state.articles.map((e, i) => <Article key={i} article={e} />)}
            </div>);
        } else {
            return <p>Loading...</p>
        }
    }
}

function Article(props) {
    let a = { ...props.article };
    a.title = a.title.split(' - ');
    let source = a.title[1];
    a.title = a.title[0].split(' | ')[0];
    if (a.content && a.content.match(/\[\+[0-9]{4,} chars\]/g)) {
        a.content = a.content.slice(0, a.content.indexOf(a.content.match(/\[\+[0-9]{4,} chars\]/g)));
    } else {
        a.content = undefined;
    }
    return (<article className="article" key={props.i}>
        <img className="clickable" onClick={_ => window.open(a.url)} src={a.urlToImage} alt={a.source && a.source.name} onError={e => e.target.src = imgerr}></img>
        <p className="content">{a.content}</p>
        <div className="article-title">
            <h2 className="clickable title" onClick={_ => window.open(a.url)}>{a.title}</h2>
            <h4 className="source">{source}</h4>
        </div>
        <h3 className="description">{a.description}</h3>
        <ul className="tags">{randomTags().map(tag => <li className="tag"><img src={`${process.env.PUBLIC_URL}/icons/8values/${tag}.svg`} alt={tag} title={tag}></img></li>)}</ul>
    </article>);
}

ReactDOM.render(<App />, document.getElementById('root'));
