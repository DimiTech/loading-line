(function(global) {

	/**
	*	Widget constructor
	*
	*	@class LoadingLine
	*	@classdesc Creates a new "loading line" widget inside the given <div> element
	*
	*	@param {Object} options - Options for initializing the component
	*	@param {Object} options.div - The div element which will contain the widget
	*	@param {Number} options.percent - A number from 0 to 100 which will set the initial widget percentage
	*
	*/
	var LoadingLine = function(options) {

		setMinWidth(this, options.minWidth || 0);

		setParentDiv(this, options.div);

		createWidget(this);

		this.setPercent(options.percent || 0); // Short-circuit evaluate the percent value

		this.show(); // Show the widget when it's finished loading

	};

	/* ------------------------------------- Private functions ------------------------------------- */

	// Handles declaring the user given <div> element as the parentElement property 
	function setParentDiv(self, parentDiv) {
		if (parentDiv[0] !== undefined && parentDiv[0].tagName === 'DIV') // Handle the jQuery selector
			self.parentElement = parentDiv[0];
		else if (parentDiv.tagName === 'DIV') // Handle document.getElementById()
			self.parentElement = parentDiv;
		else // The user hasn't supplied a proper parent <div> element
			throw new Error('Please supply a <div> element in which you wish to load the "LoadingLine" widget into.');
	}

	// Creates HTML elements needed for the widget
	function createWidget(self) {
		// Create a container <div>
		self.widget = document.createElement('div');
		self.widget.className = 'loading-line-container'; 
		self.parentElement.appendChild(self.widget);

		self.hide(); // Hide the widget until it loads

		// Create a loading line <div> and append it to the container <div>
		var loadingLineDiv = document.createElement('div');
		loadingLineDiv.className = 'loading-line';
		self.widget.appendChild(loadingLineDiv);

		// Create a 'head' <div> and append it to the loading line <div>
		var headDiv = document.createElement('div');
		headDiv.className = 'loading-line-head';
		self.widget.children[0].appendChild(headDiv);
	}


	function renderLine(self) {
		var loadingLineDiv = self.widget.children[0];
		if (self.percent > self.minWidth)
			loadingLineDiv.style.width = self.percent + '%';
		else
			loadingLineDiv.style.width = self.minWidth + '%';
	}

	function setMinWidth(self, minWidth) {
		if (typeof minWidth === 'number')
			self.minWidth = ~~minWidth;
		else 
			self.minWidth = 0;
	}


	// Checks and cleans percent values
	function cleanPercentage(percent, funct) {
		if (typeof percent === 'number') {
			percent = ~~ percent; // Cast to int
			if (percent < -100)
				percent = -100;
			else if (percent > 100)
				percent = 100;
		} else 
			throw new Error(funct + ' expects a number parameter! (a value from 0 to 100)');
		return percent;
	}

	/* ---------------------------------------- Public API ---------------------------------------- */

	LoadingLine.prototype.setPercent = function(percent) {

		percent = cleanPercentage(percent, 'setPercent()');

		// Set the percent
		this.percent = percent;

		// Render the widget		
		renderLine(this);

	};

	LoadingLine.prototype.addPercent = function(percent) {

		percent = cleanPercentage(percent, 'addPercent()');

		if (this.percent + percent > 100)
			this.percent = 100;
		else if (this.percent + percent < 0)
			this.percent = 0;

		else this.percent += percent;

		renderLine(this);

	};

	LoadingLine.prototype.getPercent = function() {
		return this.percent;
	};

	LoadingLine.prototype.hide = function() {
		this.widget.style.visibility = 'hidden';
	};

	LoadingLine.prototype.show = function() {
		this.widget.style.visibility = 'visible';
	};


	/* ------------------------------------ Public Constructor ------------------------------------ */

	global.LoadingLine = LoadingLine;

})(window);