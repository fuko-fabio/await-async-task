# await-async-task
Waits for async operations to be completed. Useful for testing async operations and timers.

## Installation
```bash
npm install await-async-task --save-dev
OR
yarn add await-async-task -D
```

## Usage
React component with async call in `componentDidMount`
```javascript
import React from 'react';
import { shallow } from 'enzyme';
import axios from "axios";
import MockAdapter from 'axios-mock-adapter';
import { asyncTasks } from 'await-async-task';

const axiosMock = new MockAdapter(axios);

export class MyComponent extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            status: "Loading"
        };
    }

    async componentDidMount() {
        try {
            await await axios.get("/my/path");
            this.setState({status: "Success"})
        } catch (e) {
            this.setState({status: "Error"})
        }
    }

    render() {
        return this.state.status;
    }
}

test("waits for component fetch success", async () => {
    axiosMock.onGet("/my/path").replyOnce(200);
    const wrapper = shallow(<MyComponent/>);

    expect(wrapper.text()).toEqual("Loading");
    await asyncTasks();

    expect(wrapper.text()).toEqual("Success");
});
```

React component with debounced action
```javascript
import React from 'react';
import { shallow } from 'enzyme';
import debounce from "lodash.debounce"
import { asyncTasks } from 'await-async-task';

const debounceTime = 500;

export class MyComponent extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            status: "Loading"
        };
    }

    debounceMe = debounce(async () => {
        this.setState({status: "Debounced"})
    }, debounceTime);

    render() {
        return (
            <div>
                <button onClick={this.debounceMe}>Fetch</button>
                <span>{this.state.status}</span>
            </div>
        )
    }
}

test("waits for component debounced action", async () => {
    const wrapper = shallow(<MyComponent/>);

    expect(wrapper.find('span').text()).toEqual("Loading");

    wrapper.find('button').simulate('click');

    expect(wrapper.find('span').text()).toEqual("Loading");

    await asyncTasks(debounceTime);

    expect(wrapper.find('span').text()).toEqual("Debounced");
});

```

React component with `useEffect` hook and async call
```javascript
import React, { useState, useEffect } from 'react';
import { mount } from 'enzyme';
import axios from "axios";
import MockAdapter from 'axios-mock-adapter';
import { asyncTasks } from 'await-async-task';

const axiosMock = new MockAdapter(axios);

const MyComponent = () => {
    const [status, setStatus] = useState("Loading");

    useEffect(() => {
        axios.get("/my/path")
            .then(() => setStatus("Success"))
            .catch(() => setStatus("Error"));
    });

    return <span>{status}</span>;
};

test("waits for component fetch", async () => {
    axiosMock.onGet("/my/path").replyOnce(200);
    const wrapper = mount(<MyComponent/>);

    expect(wrapper.find('span').text()).toEqual("Loading");

    await asyncTasks();
    wrapper.update();

    expect(wrapper.find('span').text()).toEqual("Success");
});


```
