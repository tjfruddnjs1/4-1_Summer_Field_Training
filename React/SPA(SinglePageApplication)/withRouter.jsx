import React from "react";
import { withRouter } from "react-router-dom";
class Login extends React.Component {
  goToSignup() {
    this.props.history.push("/signup");
  }
  render() {
    return (
      <div>
        <div class="btn signup-btn" onClick={this.goToSignup.bind(this)}>
          회원가입
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
