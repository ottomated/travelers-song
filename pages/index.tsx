import React, { createContext, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import {
	Container,
	Box,
	Text,
	Heading,
	Button,
	AspectRatio,
} from '@chakra-ui/react';
import HexGrid from '@components/HexGrid';

const audioData = [
	'banjo',
	'drums',
	'flute',
	'harmonica',
	'piano',
	'prisoner',
	'whistling',
];

interface Instruments {
	[key: string]: {
		source: HTMLAudioElement;
		sourceNode: MediaElementAudioSourceNode;
	};
}

interface AppContext {
	instruments: Instruments;
	onPlay: () => void;
	onScroll: () => void;
}

export const Context = createContext<AppContext>({} as unknown as AppContext);

const Index: NextPage = () => {
	const [instruments, setInstruments] = useState<Instruments>({});
	const [helpText, setHelpText] = useState('click to start');
	const [needInput, setNeedInput] = useState(false);

	useEffect(() => {
		const songEncoded =
			new URLSearchParams(location.search).get('song') || 'e30=';

		let song: any = {};
		try {
			song = JSON.parse(atob(songEncoded));
		} catch (_) {
			window.history.replaceState({}, '', '/');
		}

		console.log(song);

		(async () => {
			const context = new AudioContext();

			const instruments: Instruments = {};
			let shouldTryToPlay = false;
			const loading = [];
			for (const i of audioData) {
				const source = new Audio();
				loading.push(
					new Promise((r) => source.addEventListener('loadeddata', r))
				);
				source.loop = true;
				source.src = `/${i}.wav`;
				if (song[i]) shouldTryToPlay = true;
				source.volume = song[i] || 0;
				source.load();
				const sourceNode = context.createMediaElementSource(source);
				sourceNode.connect(context.destination);

				instruments[i] = {
					source,
					sourceNode,
				};
			}
			if (shouldTryToPlay) {
				try {
					await Promise.all(loading);
					await instruments[audioData[0]].source.play();

					Object.values(instruments).forEach((i) => {
						i.source.play();
					});
				} catch (e) {
					setNeedInput(true);
					console.log(e);
				}
			}
			setInstruments(instruments);
		})();
	}, []);

	const onPlay = () => {
		if (helpText === 'click to start') {
			setHelpText('scroll to change volume');
		}
	};
	const onScroll = () => {
		if (helpText === 'scroll to change volume') {
			setHelpText('copy URL to share');
		}
	};

	const playAll = () => {
		setNeedInput(false);
		Object.values(instruments).forEach((i) => {
			i.source.play();
		});
	};

	return (
		<Context.Provider
			value={{
				instruments,
				onPlay,
				onScroll,
			}}
		>
			<Container
				maxW="container.md"
				centerContent
				p={8}
				h="100vh"
				display="flex"
				justifyContent="center"
				alignItems="center"
				flexDir="column"
			>
				<Heading>
					travelers by{' '}
					<a
						href="https://twitter.com/Ottomated_"
						style={{ textDecoration: 'underline' }}
						target="_blank"
						rel="noreferrer"
					>
						Ottomated
					</a>
				</Heading>
				{helpText && (
					<Text sx={{ color: 'gray', fontSize: 18 }}>{helpText}</Text>
				)}
				<AspectRatio w="100%" ratio={1} overflow="visible" mt={10}>
					<Box style={{ overflow: 'visible' }}>
						{needInput ? (
							<Button onClick={playAll} colorScheme="teal">
								Play
							</Button>
						) : (
							<HexGrid />
						)}
					</Box>
				</AspectRatio>
			</Container>
		</Context.Provider>
	);
};

export default Index;
