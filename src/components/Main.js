import React, { useRef } from 'react';
import dai from '../dai.png';

const Main = props => {
  const { daiTokenBalance, dappTokenBalance, stakingBalance, stakeTokens, unstakeTokens } = props;
  const input = useRef(null);
  
  const handleOnSubmit = event => {
    event.preventDefault();
    let amount = input.current.value.toString();
    amount = window.web3.utils.toWei(amount, 'ether');
    stakeTokens(amount);
  };

  return (
    <div id="content" className="mt-3">
      
      <table className="table table-borderless text-muted text-center">
        <thead>
          <tr>
            <th scope="col">Staking Balance</th>
            <th scope="col">Reward Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{tokens(stakingBalance)} mDAI</td>
            <td>{tokens(dappTokenBalance)} DAPP</td>
          </tr>
        </tbody>
      </table>

      <div className="card mb-4">
        <div className="card-body">
          <form className="mb-3" onSubmit={handleOnSubmit}>
            <div>
              <label className="float-left"><b>Stake Tokens</b></label>
              <span className="float-right text-muted">Balance: {tokens(daiTokenBalance)}</span>
            </div>
            <div className="input-group mb-4">
              <input type="text" className="form-control form-control-lg" placeholder="0" required ref={input} />
              <div className="input-group-append">
                <div className="input-group-text">
                  <img src={dai} height="32" alt="" />
                  &nbsp;&nbsp;&nbsp; mDAI
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-lg">STAKE!</button>
          </form>
          <button type="submit" className="btn btn-link btn-block btn-sm" onClick={unstakeTokens}>UNSTAKE!</button>
        </div>
      </div>

    </div>
  );
};

const tokens = n => window.web3.utils.fromWei(n, 'ether');

export default Main;