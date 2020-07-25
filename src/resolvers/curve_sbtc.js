module.exports = class Curve {
  /**
   * @param {Object} _dsa the dsa instance to access data stores
   */
  constructor(_dsa) {
    this.ABI = _dsa.ABI;
    this.address = _dsa.address;
    this.tokens = _dsa.tokens;
    this.web3 = _dsa.web3;
    this.instance = _dsa.instance;
    this.math = _dsa.math;
    this.dsa = _dsa;
  }

  /**
   * get properly formatted Curve position details
   * @param {string} address the owner address
   */
  async getPosition(address) {
    var _address = !address ? this.instance.address : address;

    var _obj = {
      protocol: "curve_sbtc",
      method: "getPosition",
      args: [_address],
    };

    return new Promise((resolve, reject) => {
      return this.dsa
        .read(_obj)
        .then((res) => {
          let _position = {};
          _position.curveBalance = this.tokens.toDecimal(res[0], "curvesbtc");
          _position.totalSupply = this.tokens.toDecimal(res[1], "curvesbtc");
          _position.virtualPrice = res[2] / 10 ** 18;
          _position.userShare =
            this.tokens.toDecimal(res[3], "curvesbtc") * 100;
          _position.renBtcPoolBalance = this.tokens.toDecimal(res[4], "renBTC");
          _position.wBtcPoolBalance = this.tokens.toDecimal(res[5], "WBTC");
          _position.sBtcPoolBalance = this.tokens.toDecimal(res[6], "sBTC");
          _position.stakedCurveBalance = this.tokens.toDecimal(
            res[7],
            "curvesbtc"
          );
          _position.rewardsEarned = this.tokens.toDecimal(res[8], "snx_ren");
          _position.rewardTokenBalance = this.tokens.toDecimal(res[9], "snx_ren");
          _position.totalCurveBalance =
            Number(_position.curveBalance) +
            Number(_position.stakedCurveBalance);
          resolve(_position);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * returns buy/dest amount and unit Amount
   * @param buyToken buy token symbol
   * @param sellToken sell token symbol
   * @param sellAmt sell token amount in decimal
   * @param slippage slippage of trade
   */
  async getBuyAmount(buyToken, sellToken, sellAmt, slippage) {
    let _slippage = !slippage ? 10 ** 16 : slippage * 10 ** 16;
    _slippage = String(this.math.bigNumInString(_slippage));

    var _obj = {
      protocol: "curve_sbtc",
      method: "getBuyAmount",
      args: [
        this.tokens.info[buyToken.toLowerCase()].address,
        this.tokens.info[sellToken.toLowerCase()].address,
        this.tokens.fromDecimal(sellAmt, sellToken),
        this.math.bigNumInString(_slippage),
      ],
    };

    return new Promise((resolve, reject) => {
      return this.dsa
        .read(_obj)
        .then((res) => {
          var _res = {
            buyAmt: this.tokens.toDecimal(res[0], buyToken),
            buyAmtRaw: res[0],
            virtualPrice: res[2] / 10 ** 18,
            unitAmt: res[1],
          };
          resolve(_res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * returns curve token amount and unit Amount
   * @param token deposit token symbol
   * @param amt deposit token amount
   * @param slippage slippage to deposit
   */
  async getDepositAmount(token, amt, slippage) {
    let _slippage = !slippage ? 10 ** 16 : slippage * 10 ** 16;
    _slippage = String(this.math.bigNumInString(_slippage));

    var _obj = {
      protocol: "curve_sbtc",
      method: "getDepositAmount",
      args: [
        this.tokens.info[token.toLowerCase()].address,
        this.tokens.fromDecimal(amt, token),
        this.math.bigNumInString(_slippage),
      ],
    };

    return new Promise((resolve, reject) => {
      return this.dsa
        .read(_obj)
        .then((res) => {
          var _res = {
            curveAmt: this.tokens.toDecimal(res[0], "curvesbtc"),
            curveAmtRaw: res[0],
            unitAmt: res[1],
            virtualPrice: res[2] / 10 ** 18,
          };
          resolve(_res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * returns curve token amount and unit Amount
   * @param token withdraw token symbol
   * @param amt withdraw token amount
   * @param slippage slippage to withdraw
   */
  async getWithdrawAmount(token, amt, slippage) {
    let _slippage = !slippage ? 10 ** 16 : slippage * 10 ** 16;
    _slippage = String(this.math.bigNumInString(_slippage));

    var _obj = {
      protocol: "curve_sbtc",
      method: "getWithdrawAmount",
      args: [
        this.tokens.info[token.toLowerCase()].address,
        this.tokens.fromDecimal(amt, token),
        this.math.bigNumInString(_slippage),
      ],
    };

    return new Promise((resolve, reject) => {
      return this.dsa
        .read(_obj)
        .then((res) => {
          var _res = {
            curveAmt: this.tokens.toDecimal(res[0], "curvesbtc"),
            curveAmtRaw: res[0],
            unitAmt: res[1],
            virtualPrice: res[2] / 10 ** 18,
          };
          resolve(_res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  /**
   * returns token amount and unit Amount
   * @param token withdraw token symbol
   * @param amt curve token amount
   * @param slippage slippage to withdraw
   */
  async getWithdrawTokenAmount(token, amt, slippage) {
    let _slippage = !slippage ? 10 ** 16 : slippage * 10 ** 16;
    _slippage = String(this.math.bigNumInString(_slippage));

    var _obj = {
      protocol: "curve_sbtc",
      method: "getWithdrawTokenAmount",
      args: [
        this.tokens.info[token.toLowerCase()].address,
        this.tokens.fromDecimal(amt, "curvesbtc"),
        this.math.bigNumInString(_slippage),
      ],
    };

    return new Promise((resolve, reject) => {
      return this.dsa
        .read(_obj)
        .then((res) => {
          var _res = {
            amt: this.tokens.toDecimal(res[0], token),
            amtRaw: res[0],
            unitAmt: res[1],
            virtualPrice: res[2] / 10 ** 18,
          };
          resolve(_res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
};
