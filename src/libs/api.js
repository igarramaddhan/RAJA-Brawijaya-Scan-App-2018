import gql from 'graphql-tag';

const mutation = {
	login: gql`
		mutation($username: String!, $password: String!) {
			login(username: $username, password: $password)
		}
	`,
	addPendaftar: gql`
		mutation addMahasiswa($nim: String!, $name: String!) {
			addMahasiswa(nim: $nim, name: $name)
		}
	`
};

const query = {
	pendaftar: gql`
		query pendaftar {
			pendaftar {
				id
				nim
				name
			}
		}
	`
};

export { mutation, query };
