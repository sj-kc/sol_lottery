import { Component } from 'react';
import lottery from './lottery';
import web3 from './web3';

class App extends Component {
  state = {
    manager: '',
    balance: '',
    amount: '',
    message: '',
    players: [],
  };

  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ manager, players, balance });
  }

  render() {
    const onSubmit = async (e) => {
      try {
        e.preventDefault();
        const { amount } = this.state;
        const value = web3.utils.toWei(amount, 'ether');

        const accounts = await web3.eth.getAccounts();

        this.setState({ message: 'Waiting on transaction success...' });

        await lottery.methods.enter().send({ from: accounts[0], value });

        this.setState({ message: 'Good luck!' });
      } catch (error) {
        this.setState({ message: error.message });
      }
    };

    const onPickWinner = async () => {
      const accounts = await web3.eth.getAccounts();

      this.setState({ message: 'Waiting on transaction success...' });

      await lottery.methods.pickWinner().send({ from: accounts[0] });

      this.setState({ message: 'A winner has been picked!' });
    };

    return (
      <div>
        <h2>Lottery Contract!</h2>
        <p>This Contract is managed by: {this.state.manager}</p>
        <div>
          There are currently {this.state.players.length} competing to win{' '}
          {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </div>

        <hr />

        <form onSubmit={onSubmit}>
          <h3>Want to try your luck?</h3>

          <label>Amount of ether to enter</label>
          <input
            value={this.state.amount}
            onChange={({ target: { value } }) =>
              this.setState({ amount: value })
            }
          />
          <div>
            <button type='submit'>Enter</button>
          </div>
        </form>

        <hr />

        <h4>Ready to pick a winner?</h4>
        <button onClick={onPickWinner}>Pick a winner</button>

        <hr />

        {!!this.state.message.length && <h1>{this.state.message}</h1>}
      </div>
    );
  }
}

export default App;
