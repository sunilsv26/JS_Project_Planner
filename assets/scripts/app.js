class DOMHelper {
  static clerEventListeners(element) {
    const clonedElement = element.cloneNode(true);
    element.replaceWith(clonedElement);
    return clonedElement;
  }

  static moveElement(elementId, newDestination) {
    const element = document.getElementById(elementId);
    const destination = document.querySelector(newDestination);
    destination.append(element);
  }
}


class Componenet {
    constructor(hostElementId,inserBefore = false){
        if (hostElementId){
            this.hostElementId = document.getElementById(hostElementId);
        }
        else{
            this.hostElementId  = document.body;
        }
        this.inserBefore = inserBefore;
    }
        
    remove(){
            if (this.tooltipElement){
            this.tooltipElement.remove()
        }
    }  
    show(){
        this.hostElementId.insertAdjacentElement(this.inserBefore ? 'beforebegin':'beforeend',this.tooltipElement)
    }
}


class Tooltip extends Componenet{
    constructor(closeNfn){
        super();
        this.closeN = closeNfn;
        this.create();
    }

    closeTolTip(){
        this.remove();
        this.closeN();
    }
     

    create(){
        const tooltipElement = document.createElement('div');
        tooltipElement.className = 'card';
        tooltipElement.textContent = "dummy";
        document.body.append(tooltipElement);
        tooltipElement.addEventListener('click',this.closeTolTip.bind(this))
        this.tooltipElement = tooltipElement;
    }

    
}

class ProjectItem {
    hasTooltip = false;
    constructor(id, updateProjectListFunction,type) {
    this.id = id;
    this.updateProjectListHandler = updateProjectListFunction;
    this.connectAddMoreInfoButton();
    this.connectSwitchButton(type);
  }

  showMoreInfoHandler(){
      if(this.hasTooltip){
          return
      }
      const tooltip = new Tooltip(()=>{this.hasTooltip = false} )
      tooltip.show();
      this.hasTooltip = true;
  }
  connectAddMoreInfoButton() {
    const projectItemElement = document.getElementById(this.id);
    let moreInfoBtn = projectItemElement.querySelector("button:first-of-type");
    moreInfoBtn.addEventListener('click',this.showMoreInfoHandler)
  }

  connectSwitchButton(type) {
    const projectItemElement = document.getElementById(this.id);
    let switchBtn = projectItemElement.querySelector("button:last-of-type");
    /* console.log(switchBtn); */
    switchBtn = DOMHelper.clerEventListeners(switchBtn);
    switchBtn.textContent = type === 'active' ? 'Finish':'Activate'
    switchBtn.addEventListener(
      "click",
      this.updateProjectListHandler.bind(null, this.id)
    );
  }

  update(updatedPrjListFn, type) {
    this.updateProjectListHandler = updatedPrjListFn;
    this.connectSwitchButton(type);
  }
}

class ProjectList {
  projects = [];

  constructor(type) {
    this.type = type;
    const prjItems = document.querySelectorAll(`#${type}-projects li`);
    /*console.dir(prjItems) */
    for (const prjItem of prjItems) {
      this.projects.push(
        new ProjectItem(prjItem.id, this.switchProject.bind(this),this.type)
      );
    }
    console.log(this.projects);
  }
  setSwitchHandlerFunction(switchHandlerFunction) {
    this.switchHandler = switchHandlerFunction;
  }

  addProject(project) {
    this.projects.push(project);
    DOMHelper.moveElement(project.id, `#${this.type}-projects ul`);
    project.update(this.switchProject.bind(this), this.type);
  }

  switchProject(projectId) {
    /* const projecItemIndex = this.projects.findIndex( i => i.id === projectId)
        this.projects.splice(projecItemIndex,1) */
    this.switchHandler(this.projects.find((prjItm) => prjItm.id === projectId));
    this.projects = this.projects.filter((prjItm) => prjItm.id !== projectId);
  }
}

class App {
  static init() {
    const activeProjectList = new ProjectList("active");
    const finishedProjectList = new ProjectList("finished");

    activeProjectList.setSwitchHandlerFunction(
      finishedProjectList.addProject.bind(finishedProjectList)
    );
    finishedProjectList.setSwitchHandlerFunction(
      activeProjectList.addProject.bind(activeProjectList)
    );
  }
}

App.init();
