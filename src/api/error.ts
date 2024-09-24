class ErrorHandler {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  newError = (message: string) => {
    const newError = new Error(`[API ${this.context}]: ${message}`);
    console.error(newError);
  };
}

export default ErrorHandler;
