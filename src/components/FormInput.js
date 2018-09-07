import React, { Component, Ref } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TextInput,
	KeyboardTypeOptions
} from 'react-native';
import * as Animatable from 'react-native-animatable';
const styles = StyleSheet.create({
	inputContainer: {
		backgroundColor: '#fff',
		borderRadius: 5,
		marginVertical: 5
	}
});
type Props = {
	placeholder: String,
	viewRef: Ref<View>,
	onChangeText: Function,
	onSubmitEditing: Function,
	inputRef: Ref<TextInput>,
	returnKeyType: String,
	returnKeyLabel: String,
	keyboardType: KeyboardTypeOptions
};
type State = {};
export default class FormInput extends Component<Props, State> {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		const {
			viewRef,
			placeholder,
			onChangeText,
			onSubmitEditing,
			inputRef,
			...props
		} = this.props;
		return (
			<Animatable.View ref={viewRef} style={styles.inputContainer}>
				<TextInput
					{...props}
					autoCapitalize="none"
					ref={inputRef}
					padding={10}
					placeholder={placeholder}
					onChangeText={onChangeText}
					onSubmitEditing={onSubmitEditing}
				/>
			</Animatable.View>
		);
	}
}
