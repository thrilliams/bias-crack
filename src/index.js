import React from 'react';
import ReactDOM from 'react-dom';
import './main.scss';
import { newsapi, particles } from './config.json';
import { articles } from './articleCache.json';
import Particles from 'react-particles-js';
import * as imgerr from './404.png';
import navbar from './navbar.svg';

async function fetchNews(method, params) {
    let searchParams = new URLSearchParams();
    for (let key in params) {
        searchParams.append(key, params[key]);
    }

    let response = await fetch(`http://newsapi.org/v2/${method}?apiKey=${newsapi}${searchParams.toString() ? '&' + searchParams.toString(): ''}`);
    return await response.json();
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = { page: 'home' };
    }

    setPage(page) {
        this.setState({ ...this.state, page: page });
    }

    render() {
        return (<>
            <nav>
                <img src={navbar} alt=""></img>
            </nav>
            {this.state.page === 'home' ? <Home /> : <ArticleContainer />}
            <Particles params={particles} />
        </>);
    }    
}

function Home() {
    return (<div className="jumbotron">
        <div className="card">
            <div className="card-icon"></div>
            <div className="card-title"></div>
            <button className="card-btn"></button>
        </div>
        <div className="card">
            <div className="card-icon"></div>
            <div className="card-title"></div>
            <button className="card-btn"></button>
        </div>
        <div className="card">
            <div className="card-icon"></div>
            <div className="card-title"></div>
            <button className="card-btn"></button>
        </div>
    </div>);
}

class ArticleContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = { articles: articles };

        fetchNews('top-headlines', { language: 'en', country: 'us', category: 'general' })
            .then(JSON.stringify)
            .then(console.log);

        // fetchNews('top-headlines', { language: 'en', country: 'us' })
        //     .then(response => this.setState({ ...this.state, articles: response.articles }));
    }

    render() {
        if (this.state.articles.length > 0) {
            return (<div id="article-container">
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
        <img onClick={_ => window.open(a.url)} src={a.urlToImage} alt={a.source && a.source.name} onError={e => e.target.src = imgerr}></img>
        <p className="content">{a.content}</p>
        <div className="article-title">
          <h2 className="title" onClick={_ => window.open(a.url)}>{a.title}</h2>
          <h4 className="source">{source}</h4>
        </div>
        <h3 className="description">{a.description}</h3>
    </article>);
}

ReactDOM.render(<App />, document.getElementById('root'));
