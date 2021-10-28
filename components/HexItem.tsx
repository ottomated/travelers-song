import { Box, Text } from '@chakra-ui/layout';
import { keyframes } from '@chakra-ui/system';
import { motion } from 'framer-motion';
import { Context } from 'pages';
import React, { FC, useContext, useEffect, useState } from 'react';

interface HexItemProps {
	i: string;
	x: number;
	y: number;
	bg: string;
}

const color = '255, 255, 255';
const opacity = 0.1;

const ripple = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(${color}, ${opacity}),
      0 0 0 1px rgba(${color}, ${opacity}),
      0 0 0 3px rgba(${color}, ${opacity}),
      0 0 0 5px rgba(${color}, ${opacity});
  }
  100% {
    box-shadow: 0 0 0 0 rgba(${color}, ${opacity}),
      0 0 0 4px rgba(${color}, ${opacity}),
      0 0 0 20px rgba(${color}, 0),
      0 0 0 30px rgba(${color}, 0);
  }
`;

const Root = motion(Box);

const HexItem: FC<HexItemProps> = ({ i, x, y, bg }) => {
	const { instruments, onPlay, onScroll } = useContext(Context);
	const instrument = instruments[i];
	const [volume, setVolume] = useState(0);
	const paused = volume < 0.01;
	useEffect(() => {
		if (!instrument) return;
		const update = () => {
			setVolume(instrument.source.paused ? 0 : instrument.source.volume);
			const data: any = {};
			for (const i in instruments) {
				const v = Math.round(instruments[i].source.volume * 100) / 100;
				if (v > 0.01) data[i] = v;
			}
			window.history.replaceState(
				{},
				'',
				'?song=' + btoa(JSON.stringify(data))
			);
		};

		instrument.source.addEventListener('play', update);
		instrument.source.addEventListener('volumechange', update);
		return () => {
			instrument.source.removeEventListener('play', update);
			instrument.source.removeEventListener('volumechange', update);
		};
	}, [instruments, instrument]);
	if (!instrument) return null;

	const handleClick = () => {
		console.log(instrument.source.paused, instrument.source.volume);
		if (instrument.source.paused || instrument.source.volume < 0.1) {
			onPlay();
			Object.values(instruments).forEach((i) => {
				i.source.play();
			});
			instrument.source.volume = 1;
		} else {
			instrument.source.volume = 0;
		}
	};
	const handleScroll = (ev: React.WheelEvent) => {
		onScroll();
		let newVolume = instrument.source.volume;
		newVolume -= ev.deltaY / 2000;

		instrument.source.volume = Math.max(0, Math.min(1, newVolume));
	};

	return (
		<Root
			animate={{ left: `${x * 0.8 + 50}%`, top: `${y * 0.8 + 50}%` }}
			initial={{
				top: '50%',
				left: '50%',
				x: '-50%',
				y: '-50%',
			}}
			whileHover={{
				scale: 1.1,
			}}
			whileTap={{ scale: 0.9 }}
			sx={{
				background: bg,
				display: 'flex',
				userSelect: 'none',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				cursor: 'pointer',
				position: 'absolute',
				width: '20%',
				height: '20%',
				borderRadius: '20%',
				animation: volume ? `${ripple} 1s ease infinite` : undefined,
				overflow: 'hidden',
			}}
			onClick={handleClick}
			onWheel={handleScroll}
		>
			<Box
				sx={{
					position: 'absolute',
					w: '100%',
					top: 0,
					opacity: 0.4,
					bg: 'black',
					// borderRadius: '20%',
				}}
				style={{ height: `${100 - volume * 100}%` }}
			/>
			<Text
				sx={{
					color: 'black',
					letterSpacing: 2,
					fontSize: 10,
					fontWeight: 'bold',
				}}
			>
				{i.toUpperCase()}
			</Text>
			<svg viewBox="0 0 24 24" width={48} height={48} color="black">
				<path
					fill="currentColor"
					d={
						!paused
							? 'M14,19H18V5H14M6,19H10V5H6V19Z'
							: 'M8,5.14V19.14L19,12.14L8,5.14Z'
					}
				/>
			</svg>
		</Root>
	);
};

export default HexItem;
