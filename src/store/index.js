import React, { Component } from 'react';

const Context = React.createContext();

type Props = {
	state: Object
};
type State = {
	setStoreState: Function
};
class AppProvider extends Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {
			...props.state,
			setStoreState: this.setStoreState
		};
	}
	setStoreState = state => {
		this.setState(state);
	};
	render() {
		return (
			<Context.Provider value={this.state}>
				{this.props.children}
			</Context.Provider>
		);
	}
}

const withConsumer = (WrappedComponent: Component) => {
	return class extends Component {
		static navigationOptions = WrappedComponent.navigationOptions;
		render() {
			return (
				<Context.Consumer>
					{context => <WrappedComponent {...this.props} store={context} />}
				</Context.Consumer>
			);
		}
	};
};

export { AppProvider, withConsumer };
