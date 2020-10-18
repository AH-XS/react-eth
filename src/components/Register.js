import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import { Form as BForm, Button, Alert } from "react-bootstrap";
import setting from "../setting.json";
import dogsERC721 from "../build/contracts/DogERC721.json";
import Web3 from "web3";

export default function Register() {
  const [error, setError] = useState();
  const [showError, setShowError] = useState(false);
  const [txHash, setTxHash] = useState();
  const [showTxHash, setShowTxHash] = useState(false);
  const onSubmit = async (value) => {
    console.log(value);
    const { ethereum } = window;

    if (typeof window.ethereum === "undefined") {
      setError("MetaMask not installed!");
      setShowError(true);
      return false;
    }

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const account = accounts[2];
    if (account === "") {
      setError("MetaMask account not found!");
      setShowError(true);
      return false;
    }
    try {
      const web3 = new Web3(
        new Web3.providers.WebsocketProvider(setting.Ethereum.Node)
      );
      const contract = new web3.eth.Contract(
        dogsERC721.abi,
        setting.Ethereum.ContractAddress
      );

      const puppy = contract.methods
        .addPuppy(
          value.name,
          value.dob,
          value.microchip,
          value.damID,
          value.sireID,
          value.sex,
          value.ownerPublicKey
        )
        .encodeABI();

      console.log(puppy);
      const transactionParameters = {
        from: ethereum.selectedAddress, // must match user's active address.
        gasPrice: setting.Ethereum.GasPrice, // customizable by user during MetaMask confirmation.
        gas: setting.Ethereum.GasLimit, // customizable by user during MetaMask confirmation.
        to: setting.Ethereum.ContractAddress, // Required except during contract publications.
        value: "0x00", // Only required to send ether to the recipient from the initiating external account.
        data: puppy, // Optional, but used for defining smart contract creation and interaction.
        chainId: 3, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
      };

      // txHash is a hex string
      // As with any RPC call, it may throw an error
      const txHash = await ethereum.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });
      setTxHash(txHash);
      setShowTxHash(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="register">
      <h2>Register your dog on the blockchain</h2>
      <Alert variant="danger" show={showError}>
        {error}
      </Alert>
      <Alert variant="primary" show={showTxHash}>
        {txHash}
      </Alert>
      <Formik
        initialValues={{
          name: "",
          dob: "",
          sex: "",
          microchip: "",
          damID: "",
          sireID: "",
          ownerPublicKey: "",
        }}
        onSubmit={onSubmit}
      >
        <Form className="mt-5">
          <BForm.Group>
            <BForm.Label className="d-block my-3">Name</BForm.Label>
            <Field
              id="name"
              name="name"
              placeholder=""
              className="d-block my-3 w-100"
            />
          </BForm.Group>
          <BForm.Group>
            <BForm.Label className="d-block my-3">DOB</BForm.Label>
            <Field
              id="dob"
              name="dob"
              placeholder=""
              className="d-block my-3 w-100"
            />
          </BForm.Group>
          <BForm.Group>
            <BForm.Label>
              <Field type="radio" id="sex" name="sex" value="0" />
              Male
            </BForm.Label>
            <BForm.Label>
              <Field type="radio" id="sex" name="sex" value="1" />
              Female
            </BForm.Label>
          </BForm.Group>
          <BForm.Group>
            <BForm.Label className="d-block my-3">Microchip</BForm.Label>
            <Field
              id="microchip"
              name="microchip"
              placeholder=""
              className="d-block my-3 w-100"
            />
          </BForm.Group>
          <BForm.Group>
            <BForm.Label className="d-block my-3">Dam ID</BForm.Label>
            <Field
              id="damID"
              name="damID"
              placeholder=""
              className="d-block my-3 w-100"
            />
          </BForm.Group>
          <BForm.Group>
            <BForm.Label className="d-block my-3">Sire ID</BForm.Label>
            <Field
              id="sireID"
              name="sireID"
              placeholder=""
              className="d-block my-3 w-100"
            />
          </BForm.Group>
          <BForm.Group>
            <BForm.Label className="d-block my-3">Owner Public Key</BForm.Label>
            <Field
              id="ownerPublicKey"
              name="ownerPublicKey"
              placeholder=""
              className="d-block my-3 w-100"
            />
          </BForm.Group>
          <Button variant="primary" type="submit">
            Register
          </Button>
        </Form>
      </Formik>
    </div>
  );
}
