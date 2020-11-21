//prototype
function Carousel(containerID, slideID) {

    this.container = document.querySelector(containerID);
    this.slides = this.container.querySelectorAll(slideID);
    this.indicatorsContainer = this.container.querySelector('#indicators-container');
    this.indicators = this.container.querySelectorAll('.indicator');
    this.pauseBtn = this.container.querySelector('#pause-btn');
    this.prevBtn = this.container.querySelector('#prev-btn');
    this.nextBtn = this.container.querySelector('#next-btn');

    this.interval = 2000;
}

Carousel.prototype = {

    _initProp() {
        this.currentSlide = 0;
        this.slidesCount = this.slides.length;
        this.intervalID = null;
        this.isPlaing = true;
        this.swipeStartX = null;
        this.swipeEndX = null;

        this.LEFT_ARROW = 'ArrowLeft';
        this.RIGHT_ARROW = 'ArrowRight';
        this.SPACE = 'Space';
        this.FA_PAUSE = '<i class="far fa-pause-circle"></i>';
        this.FA_PLAY = '<i class="far fa-play-circle"></i>';
    },

    _initListeners() {
        this.pauseBtn.addEventListener('click', this.pausePlay.bind(this));
        this.prevBtn.addEventListener('click', this.prev.bind(this));
        this.nextBtn.addEventListener('click', this.next.bind(this));
        this.indicatorsContainer.addEventListener('click', this.indicate.bind(this));
        document.addEventListener('keydown', this.pressKey.bind(this));
        this.container.addEventListener('touchstart', this.swipeStart.bind(this));
        this.container.addEventListener('touchend', this.swipeEnd.bind(this));

    },

    _gotoSlide(n) {
        this.slides[this.currentSlide].classList.toggle('active');
        this.indicators[this.currentSlide].classList.toggle('active');
        this.currentSlide = (n + this.slidesCount) % this.slidesCount;
        this.indicators[this.currentSlide].classList.toggle('active');
        this.slides[this.currentSlide].classList.toggle('active');
    },

    _gotoPrev() {
        this._gotoSlide(this.currentSlide - 1);
    },

    _gotoNext() {
        this._gotoSlide(this.currentSlide + 1);
    },

    _play() {
        this.intervalID = setInterval(() => this._gotoNext(), this.interval);
        this.pauseBtn.innerHTML = this.FA_PAUSE;
        this.isPlaing = true;
    },

    _pause() {
        if (this.isPlaing) {
            clearInterval(this.intervalID);
            this.pauseBtn.innerHTML = this.FA_PLAY;
            this.isPlaing = false;
        }
    },

    pausePlay() {
        this.isPlaing ? this._pause() : this._play();
    },

    prev() {
        this._pause();
        this._gotoPrev();
    },

    next() {
        this._pause();
        this._gotoNext();
    },

    indicate(e) {
        let target = e.target;

        if (target.classList.contains('indicator')) {
            this._pause();
            // this._gotoSlide(+target.getAttribute('data-slide-to'));
            this._gotoSlide(+target.dataset.slideTo);
        }
    },

    pressKey(e) {
        if (e.code === this.LEFT_ARROW) this.prev();
        if (e.code === this.RIGHT_ARROW) this.next();
        if (e.code === this.SPACE) this.pausePlay();
    },

    swipeStart(e) {
        this.swipeStartX = e.changedTouches[0].pageX;
    },

    swipeEnd(e) {
        this.swipeEndX = e.changedTouches[0].pageX;
        if ((this.swipeStartX - this.swipeEndX) > 100) this.next();
        if ((this.swipeStartX - this.swipeEndX) < -100) this.prev();
    },

    init() {
        this._initProp();
        this._initListeners();

        this.intervalID = setInterval(() => this._gotoNext(), this.interval);
    }
}