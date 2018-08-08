import React, { Component } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	}
});

type Props = {
	children: React.ReactNode,
	visible: Boolean,
	onRequestClose: Function,
	transparent: Boolean
};
const ModalView = (props: Props) => {
	return (
		<Modal
			animationType="fade"
			transparent={props.transparent}
			visible={props.visible}
			onRequestClose={props.onRequestClose}
		>
			{props.children}
		</Modal>
	);
};

ModalView.defaultProps = {
	visible: false,
	onRequestClose: () => {},
	transparent: false
};
export default ModalView;
