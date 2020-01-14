socket_exist = true;
graph_data = {
	nodes: [
		{
			name: 'C',
			value: 1,
			symbolSize: 120,
			category: 1
		},
		{
			name: 'Python',
			value: 2,
			symbolSize: 80,
			category: 2
		},
		{
			name: 'Java',
			value: 3,
			symbolSize: 60,
			category: 2
		},
		{
			name: 'C++',
			value: 4,
			symbolSize: 100,
			category: 3
		},
		{
			name: 'PHP',
			value: 5,
			symbolSize: 50,
			category: 3
		}
	],
	edges: [
		{
			source: 0,
			target: 1,
			value: 10
		},
		{
			source: 3,
			target: 2,
			value: 10
		},
		{
			source: 0,
			target: 4,
			value: 10
		},
		{
			source: 1,
			target: 4,
			value: 10
		},
		{
			source: 2,
			target: 5,
			value: 10
		},
		{
			source: 3,
			target: 5,
			value: 10
		}
	]
}