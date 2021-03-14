let wipRoot = null;
function render(vnode, container) {
  wipRoot = {
    type: 'div',
    props: {
      children: { ...vnode }
    },
    stateNode: container
  };
  nextUnitOfWork = wipRoot;
}

function createNode(workInProgress) {
  const { type, props } = workInProgress;
  const node = document.createElement(type);
  updateNode(node, props);
  return node;
}

function updateHostComponent(workInProgress) {
  const { props } = workInProgress;
  if (!workInProgress.stateNode) {
    workInProgress.stateNode = createNode(workInProgress);
  }
  reconcileChilren(workInProgress, props.children);
  console.log('workInProgress: ', workInProgress);
}

function updateNode(node, nextVal) {
  Object.keys(nextVal).forEach((k) => {
    if (k === 'children') {
      if(typeof nextVal[k] === 'string'){
        node.textContent = nextVal[k];
      }      
    } else {
      node[k] = nextVal[k];
    }
  });
}

function updateClassComponent(vnode) {
  const { type, props } = vnode;
  const instance = new type(props);
  const vvnode = instance.render();
  const node = createNode(vvnode);
  return node;
}

function updateFunctionComponent(vnode) {
  const { type, props } = vnode;
  const vvnode = type(props);
  const node = createNode(vvnode);
  return node;
}

function reconcileChilren(workInProgress, children) {
  if (typeof children === 'string' || typeof children === 'number') {
    return;
  }
  const newChildren = Array.isArray(children) ? children : [children];
  let previousNewFiber = null;
  for (let i = 0; i < newChildren.length; i++) {
    let child = newChildren[i];
    let newFiber = {
      type: child.type,
      props: { ...child.props },
      stateNode: null,
      child: null,
      sibling: null,
      return: workInProgress
    };
    if (i === 0) {
      workInProgress.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
  }
}

function updateTextComponent(vnode) {
  const node = document.createTextNode(vnode);
  return node;
}

let nextUnitOfWork = null;

function performanceUnitOfWork(workInProgress) {
  const { type } = workInProgress;

  if (typeof type === 'string') {
    updateHostComponent(workInProgress);
  }
  if (workInProgress.child) {
    return workInProgress.child;
  }

  let nextFiber = workInProgress;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
  }
}

function workLoop(IdleDeadline) {
  while (nextUnitOfWork && IdleDeadline.timeRemaining() > 1) {
    nextUnitOfWork = performanceUnitOfWork(nextUnitOfWork);
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
}

function commitRoot() {
  commitWork(wipRoot.child);
  wipRoot = null;
}

function commitWork(workInProgress) {
  if (!workInProgress) {
    return;
  }

  let parentNodeFiber = workInProgress.return;
  let parentNode = parentNodeFiber.stateNode;
  if (workInProgress.stateNode) {
    parentNode.appendChild(workInProgress.stateNode);
  }
  commitWork(workInProgress.child);
  commitWork(workInProgress.sibling);
}

requestIdleCallback(workLoop);

export default { render };
