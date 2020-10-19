import React from "react";
import {DrawerToggleButton} from "./NetworkSideDrawer";
import NetworkSideDrawer from "./NetworkSideDrawer";


import "./NetworkNavBar.css";

class NetworkNavBar extends React.Component{
  constructor(props){
    super(props);
    this.state = {search: "", color: "black"}
    this.settings = React.createRef();
    this.app = this.props.app;
  }

  openSettings(){
    const open = this.settings.current.state.open;
    this.settings.current.setOpen(!open);
  }

  setSearch(e){
    e.preventDefault();
    this.setState({search: e.target.value, color:"black"});
  }

  openSearch(e){
    e.preventDefault();
    const search_term = this.state.search;
    var link = document.createElement('a');
    link.setAttribute("target", "_blank");
    if(search_term.toLowerCase() === "basic spring embedding") {
      link.href = "https://github.com/alexandreLamarre/Network-Algorithm-Visualization#basic-spring-embedding"
    }
    if(search_term.toLowerCase() === "fruchterman-reingold"){
      link.href = "https://github.com/alexandreLamarre/Network-Algorithm-Visualization#fruchterman-reingold"
    }
    if(search_term.toLowerCase() === "force atlas 2"){
      link.href = "https://github.com/alexandreLamarre/Network-Algorithm-Visualization#force-atlas-2"
    }
    if(search_term.toLowerCase() === "force atlas 2 (linlog)"){
      link.href = "https://github.com/alexandreLamarre/Network-Algorithm-Visualization#force-atlas-2-linlog"
    }
    if(search_term.toLowerCase() === "generalized eigenvector spectral drawing"){
      link.href = "https://github.com/alexandreLamarre/Network-Algorithm-Visualization#generalized-eigenvector-koren"
    }
    if(search_term.toLowerCase() === "schwarz based method"){
      link.href = "https://github.com/alexandreLamarre/Network-Algorithm-Visualization#schwarz-based-method"
    }
    if(search_term.toLowerCase() === "kruskal's algorithm"){
      link.href = "https://github.com/alexandreLamarre/Network-Algorithm-Visualization#kruskal"
    }
    if(search_term.toLowerCase() === "prim's algorithm"){
      link.href = "https://github.com/alexandreLamarre/Network-Algorithm-Visualization#prim"
    }
    if(search_term.toLowerCase() === "2-opt"){
      link.href = "https://github.com/alexandreLamarre/Network-Algorithm-Visualization#2-opt"
    }
    if(search_term.toLowerCase() === "3-opt"){
      link.href = "https://github.com/alexandreLamarre/Network-Algorithm-Visualization#3-opt"
    }
    if(search_term.toLowerCase() === "2-opt simulated annealing"){
      link.href = "https://github.com/alexandreLamarre/Network-Algorithm-Visualization#2-opt-simulated-annealing"
    }
    if(search_term.toLowerCase() === "greedy coloring"){
      link.href = "https://github.com/alexandreLamarre/Network-Algorithm-Visualization#greedy-coloring"
    }
    if(search_term.toLowerCase() === "misra-gries"){
      link.href = "https://github.com/alexandreLamarre/Network-Algorithm-Visualization#misra-gries"
    }

    if(link != ""){
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    else {
      this.setState({color:"red"});
    }
  }

  render(){
    return <div className = "gonavbar">
              <NetworkSideDrawer height = {this.props.height}
              ref = {this.settings} app = {this.app}></NetworkSideDrawer>
              <header className = "toolbar" style = {{height: this.props.height*1/20}}>
                <nav className ="toolbar__navigation">
                  <div><DrawerToggleButton openSettings = {() => this.openSettings()}
                  height = {this.props.height}></DrawerToggleButton></div>
                  <div className = "toolbar__logo"
                  style = {{fontSize: this.props.height/40, marginTop: this.props.height/240}} >
                  <a > Network Analysis {this.app.state.dimension}{this.app.state.dimension === "Custom"?"":"D"}
                  </a></div>

                  <div className ="toolbar__search"
                  style = {{fontSize: this.props.height/40, marginTop: this.props.height/240}}>
                      <form onChange = {(e) => this.setSearch(e)}
                      onSubmit = {(e) => this.openSearch(e)}>
                      <label> Search :
                      </label>
                      <input minLength = "2" list = "search_values"
                      style = {{color: this.state.color}}/>
                      <datalist id = "search_values">
                        <option value = "Basic Spring Embedding"/>
                        <option value = "Fruchterman-Reingold"/>
                        <option value = "Force Atlas 2"/>
                        <option value = "Force Atlas 2 (LinLog)"/>
                        <option value = "Generalized Eigenvector Spectral Drawing"/>
                        <option value = "Schwarz Based Method"/>
                        <option value = "Kruskal's Algorithm"/>
                        <option value = "Prim's Algorithm"/>
                        <option value = "2-Opt"/>
                        <option value = "3-Opt"/>
                        <option value = "2-Opt simulated annealing"/>
                        <option value = "Greedy Coloring"/>
                        <option value = "Misra-Gries"/>
                      </datalist>
                      </form>
                  </div>

                </nav>
              </header>
            </div>
  }
}

export default NetworkNavBar;
