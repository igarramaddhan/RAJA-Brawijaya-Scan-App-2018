import React, { Component } from 'react';

const Context = React.createContext();

class AppProvider extends Component {
	constructor(props) {
		super(props);
		this.state = {
			// tokenKesehatan: '',
			// setTokenKesehatan: this.setTokenKesehatan,
			// removeTokenKesehatan: this.removeTokenKesehatan
			...props.state,
			setStoreState: this.setStoreState
		};
	}
	// setTokenKesehatan = (token: String) => {
	// 	this.setState({ tokenKesehatan: token });
	// };
	// removeTokenKesehatan = () => {
	// 	this.setState({ tokenKesehatan: '' });
	// };
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

const withConsumer = WrappedComponent => {
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
