import React, { FC } from 'react';
import HexItem from './HexItem';

const grad = 'linear-gradient(135deg, #ed901a, #c03906)';
// 16.5, 9.526279441628825

const HexGrid: FC = () => {
	return (
		<>
			<HexItem i="banjo" bg={grad} x={0} y={50} />
			<HexItem i="drums" bg={grad} x={0} y={-50} />
			<HexItem
				i="flute"
				bg={grad}
				x={43.35260115606937}
				y={-25.14450867052023}
			/>
			<HexItem
				i="harmonica"
				bg={grad}
				x={43.35260115606937}
				y={25.14450867052023}
			/>
			<HexItem
				i="piano"
				bg={grad}
				x={-43.35260115606937}
				y={-25.14450867052023}
			/>
			<HexItem
				i="whistling"
				bg={grad}
				x={-43.35260115606937}
				y={25.14450867052023}
			/>
			<HexItem
				i="theramin"
				bg="linear-gradient(135deg, #1de5d6, #00a98e)"
				x={0}
				y={0}
			/>
		</>
	);
};

export default HexGrid;
