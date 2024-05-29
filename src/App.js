import React, { Component } from 'react';
import Bar from './components/Bar';
import Form from './components/Form';
import Shepherd from 'shepherd.js';
import '../node_modules/shepherd.js/dist/cjs/css/shepherd.css';


import BubbleSort from './algorithms/BubbleSort';
import MergeSort from './algorithms/MergeSort';
import QuickSort from './algorithms/QuickSort';
import InsertionSort from './algorithms/InsertionSort';
import SelectionSort from './algorithms/SelectionSort';

import Play from '@material-ui/icons/PlayCircleOutlineRounded';
import Forward from '@material-ui/icons/SkipNextRounded';
import Backward from '@material-ui/icons/SkipPreviousRounded';
import Pause from '@material-ui/icons/PauseCircleOutline';
import RotateLeft from '@material-ui/icons/RotateLeft';

import './styles/RiseUpText/RiseUpText.css';
import { riseText } from './styles/RiseUpText/RiseUpText';
import './App.css';

class App extends Component {
	state = {
		array: [],
		arraySteps: [],
		colorKey: [],
		colorSteps: [],
		timeouts: [],
		currentStep: 0,
		barCount: 10,
		delay: 300,
		algorithm: 'Bubble Sort',
	};

	componentDidMount() {
		this.createTour();
		window.addEventListener('load', riseText);
		this.generateBars();
	}

	createTour = () => {
		const tour = new Shepherd.Tour({
			defaultStepOptions: {
				cancelIcon: {
					enabled: true,
				},
				classes: 'shepherd-theme-arrows',
				scrollTo: { behavior: 'smooth', block: 'center' },
			},
			useModalOverlay: true,
		});
	
		tour.addStep({
			id: 'step1',
			text: 'Welcome to the Sorting Visualizer! This is where you can see different sorting algorithms in action.',
			attachTo: {
				element: '.page-header_title-main',
				on: 'bottom',
			},
			buttons: [
				{
					text: 'Next',
					action: tour.next,
					classes: 'shepherd-button shepherd-button-primary',
				},
			],
		});
	    tour.addStep({
			id: 'step2',
			text: 'These are the bars you can sort. Click on + or - to increase or decrease the bar value.',
			attachTo: {
				element: '.barsDiv',
				on: 'bottom',
			},
			buttons: [
				{
					text: 'Next',
					action: tour.next,
					classes: 'shepherd-button shepherd-button-primary',
				},
			],
		});
		tour.addStep({
			id: 'step3',
			text: 'You can control the sorting animation using these buttons. Click the play button to start the animation.',
			attachTo: {
				element: '.control-buttons',
				on: 'bottom',
			},
			buttons: [
				{
					text: 'Next',
					action: tour.next,
					classes: 'shepherd-button shepherd-button-primary',
				},
			],
		});
	
		tour.addStep({
			id: 'step4',
			text: 'Here, you can select different sorting algorithms from the dropdown menu.',
			attachTo: {
				element: '.pannel',
				on: 'left',
			},
			buttons: [
				{
					text: 'Next',
					action: tour.next,
					classes: 'shepherd-button shepherd-button-primary',
				},
			],
		});
	
		tour.addStep({
			id: 'step5',
			text: 'Choose "Bubble Sort" to start with.',
			attachTo: {
				element: '.pannel',
				on: 'left',
			},
			buttons: [
				{
					text: 'Next',
					action: tour.next,
					classes: 'shepherd-button shepherd-button-primary',
				},
			],
		});
	
		tour.addStep({
			id: 'step6',
			text: 'Now, let\'s adjust the number of items in the array.',
			attachTo: {
				element: '.pannel',
				on: 'bottom',
			},
			buttons: [
				{
					text: 'Next',
					action: tour.next,
					classes: 'shepherd-button shepherd-button-primary',
				},
			],
		});
	
		tour.addStep({
			id: 'step7',
			text: 'Select the desired number of items here.',
			attachTo: {
				element: '.pannel',
				on: 'bottom',
			},
			buttons: [
				{
					text: 'Next',
					action: tour.next,
					classes: 'shepherd-button shepherd-button-primary',
				},
			],
		});
	
		tour.addStep({
			id: 'step8',
			text: 'You can also change the sorting speed.',
			attachTo: {
				element: '.pannel',
				on: 'right',
			},
			buttons: [
				{
					text: 'Next',
					action: tour.next,
					classes: 'shepherd-button shepherd-button-primary',
				},
			],
		});
	
		tour.addStep({
			id: 'step9',
			text: 'Adjust the speed here.',
			attachTo: {
				element: '.pannel',
				on: 'right',
			},
			buttons: [
				{
					text: 'Next',
					action: tour.next,
					classes: 'shepherd-button shepherd-button-primary',
				},
			],
		});
	
		tour.addStep({
			id: 'step10',
			text: 'That\'s it! Click the play button to start sorting.',
			attachTo: {
				element: '.control-buttons',
				on: 'bottom',
			},
			buttons: [
				{
					text: 'Finish',
					action: tour.complete,
					classes: 'shepherd-button shepherd-button-primary',
				},
			],
		});
	
		tour.start();
	};
	
	ALGORITHMS = {
		'Bubble Sort': BubbleSort,
		'Merge Sort': MergeSort,
		'Quick Sort': QuickSort,
		'Insertion Sort': InsertionSort,
		'Selection Sort': SelectionSort,
	};

	setTimeouts = () => {
		let steps = this.state.arraySteps;
		let colorSteps = this.state.colorSteps;

		this.clearTimeouts();
		let timeouts = [];

		let i = 0;

		while (i < steps.length - this.state.currentStep) {
			let timeout = setTimeout(() => {
				let currentStep = this.state.currentStep;
				this.setState({
					array: steps[currentStep],
					colorKey: colorSteps[currentStep],
					currentStep: currentStep + 1,
				});
				timeouts.push(timeout);
			}, this.state.delay * i);
			i++;
		}

		this.setState({
			timeouts: timeouts,
		});
	};

	changeAlgorithm = (e) => {
		this.clearTimeouts();
		this.clearColorKey();
		this.setState(
			{
				algorithm: e.target.value,
				currentStep: 0,
				arraySteps: [
					this.state.arraySteps[
						this.state.currentStep === 0 ? 0 : this.state.currentStep - 1
					],
				],
			},
			() => this.generateSteps()
		);
	};

	clearTimeouts = () => {
		this.state.timeouts.forEach((timeout) => clearTimeout(timeout));
		this.setState({ timeouts: [] });
	};

	clearColorKey = () => {
		let blankKey = new Array(this.state.barCount).fill(0);
		this.setState({ colorKey: blankKey, colorSteps: [blankKey] });
	};

	stepBack = () => {
		let currentStep = this.state.currentStep;

		if (currentStep === 0) return;
		this.clearTimeouts();
		currentStep -= 1;
		this.setState({
			array: this.state.arraySteps[currentStep],
			colorKey: this.state.colorSteps[currentStep],
			currentStep: currentStep,
		});
	};

	stepForward = () => {
		let currentStep = this.state.currentStep;

		if (currentStep >= this.state.arraySteps.length - 1) return;
		this.clearTimeouts();
		currentStep += 1;
		this.setState({
			array: this.state.arraySteps[currentStep],
			colorKey: this.state.colorSteps[currentStep],
			currentStep: currentStep,
		});
	};

	generateSteps = () => {
		let array = this.state.array.slice();
		let steps = this.state.arraySteps.slice();
		let colorSteps = this.state.colorSteps.slice();

		this.ALGORITHMS[this.state.algorithm](array, 0, steps, colorSteps);

		this.setState({
			arraySteps: steps,
			colorSteps: colorSteps,
		});
	};

	generateRandomNumber = (min, max) => {
		return Math.floor(Math.random() * (max - min) + min);
	};

	generateBars = () => {
		this.clearTimeouts();
		this.clearColorKey();

		let barCount = this.state.barCount;
		let arr = [];

		for (let i = 0; i < barCount; i++) {
			arr.push(this.generateRandomNumber(50, 200));
		}

		this.setState(
			{
				array: arr,
				arraySteps: [arr],
				barCount: barCount,
				currentStep: 0,
			},
			() => this.generateSteps()
		);
	};

	changeArray = (index, value) => {
		let array = this.state.array;
		array[index] = value;
		this.setState(
			{
				array: array,
				arraySteps: [array],
				currentStep: 0,
			},
			() => this.generateSteps()
		);
	};

	changeBarCount = (e) => {
		this.clearTimeouts();
		this.clearColorKey();
		this.setState(
			{
				barCount: parseInt(e.target.value),
			},
			() => this.generateBars()
		);
	};

	changeSpeed = (e) => {
		this.clearTimeouts();
		this.setState({
			delay: parseInt(e.target.value),
		});
	};

	render() {
		let barsDiv = this.state.array.map((value, index) => (
			<Bar
				key={index}
				index={index}
				length={value}
				color={this.state.colorKey[index]}
				changeArray={this.changeArray}
			/>
		));
		let playButton;

		if (this.state.arraySteps.length === this.state.currentStep) {
			playButton = (
				<button className='controller' onClick={this.generateBars}>
					<RotateLeft />
				</button>
			);
		} else {
			playButton = (
				<button className='controller' onClick={this.setTimeouts}>
					<Play />
				</button>
			);
		}

		return (
			<div className='app'>
				<h1 className='page-header_title risetext'>
					<span className='page-header_title-main enclose'>
						Sorting Visualizer
					</span>
				</h1>
				
				<div className='frame'>
					<div className='barsDiv container card'>{barsDiv}</div>
				</div>
				
				<div className='control-pannel'>
					<div className='control-buttons'>
						<button className='controller' onClick={this.stepBack}>
							<Backward />
						</button>
						{playButton}
						<button className='controller' onClick={this.stepForward}>
							<Forward />
						</button>
					</div>
				</div>
				
				<div className='pannel'>
					<Form
						formLabel='Algorithms'
						values={[
							'Bubble Sort',
							'Merge Sort',
							'Quick Sort',
							'Insertion Sort',
							'Selection Sort',
						]}
						labels={[
							'Bubble Sort',
							'Merge Sort',
							'Quick Sort',
							'Insertion Sort',
							'Selection Sort',
						]}
						currentValue={this.state.algorithm}
						onChange={this.changeAlgorithm}
						className="form-algorithms"
					/>
					<Form
						formLabel='Items'
						values={[10, 15, 20, 25, 30]}
						labels={[10, 15, 20, 25, 30]}
						currentValue={this.state.barCount}
						onChange={this.changeBarCount}
					/>
					<Form
						formLabel='Speed'
						values={[500, 400, 300, 200, 100]}
						labels={['1x', '2x', '3x', '4x', '5x']}
						currentValue={this.state.delay}
						onChange={this.changeSpeed}
						className="form-speed"
					/>
				</div>
			</div>
		);
	}
}

export default App;
