//IIFE -> Immediatle Invoke Function Expression
(() => {
  const BTNRESET = 'btnReset';
  const ID_COUNTER = 'counter';
  const COUNT_VALUE = 100;
  const TIME_INTERVAL = 10;

  class CountComponent {
    constructor() {
      this.start();
    }

    readyCounterProxy() {
      const handler = {
        set: (currentContext, propertykey, newValue) => {
          console.log({ currentContext, propertykey, newValue });
          // Stop all process
          if (!currentContext.value) {
            currentContext.stopCount();
          }
          currentContext[propertykey] = newValue;
          return true;
        },
      };

      const counter = new Proxy(
        {
          value: COUNT_VALUE,
          stopCount: () => {},
        },
        handler
      );

      return counter;
    }

    updateText = ({ elementCounter, counter }) => () => {
      const identText = '$$counter';
      const textDefault = `Starting in <strong> ${identText} </strong> seconds...`;
      elementCounter.innerHTML = textDefault.replace(
        identText,
        counter.value--
      );
    };

    //partial function
    calendarStopCounter({ elementCounter, idInterval }) {
      return () => {
        clearInterval(idInterval);
        elementCounter.innerHTML = '';
        this.disableButton(false);
      };
    }
    readyButton(buttonElement, startFun) {
      buttonElement.addEventListener('click', startFun.bind(this));

      return (value = true) => {
        const attrElement = 'disabled';

        if (value) {
          buttonElement.setAttribute(attrElement, value);
          return;
        }

        buttonElement.removeAttribute(attrElement);
      };
    }

    start() {
      console.log('Started!!!');
      const elementCounter = document.getElementById(ID_COUNTER);
      const counter = this.readyCounterProxy();
      // counter.value = 100;
      // counter.value = 90;
      // counter.value = 80;

      const args = {
        elementCounter,
        counter,
      };

      const fn = this.updateText(args);
      fn();
      const idInterval = setInterval(fn, TIME_INTERVAL);

      {
        const buttonElement = document.getElementById(BTNRESET);
        const disableButton = this.readyButton(buttonElement, this.start);
        disableButton();

        const args = { elementCounter, idInterval };
        // const disableButton = () => console.log('Disable...');
        const stopCounterFn = this.calendarStopCounter.apply(
          { disableButton },
          [args]
        );
        counter.stopCount = stopCounterFn;
      }
    }
  }

  window.CountComponent = CountComponent;
})();
