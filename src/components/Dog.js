import React, { useState } from "react";
import { Formik, Field, Form } from "formik";
import { Form as BForm, Button } from "react-bootstrap";
import Web3 from "web3";
import dogsERC721 from "../build/contracts/DogERC721.json";
import setting from "../setting.json";

export default function Dog() {
  const [dog, setDog] = useState();
  const onSubmit = async (value) => {
    const { ethereum } = window;
    try {
      const web3 = new Web3(
        new Web3.providers.WebsocketProvider(setting.Ethereum.Node)
      );
      const contract = new web3.eth.Contract(
        dogsERC721.abi,
        setting.Ethereum.ContractAddress
      );
      const puppy = contract.methods.getPuppy(value.index).encodeABI();
      //console.log(puppy);

      const parameters = {
        from: ethereum.selectedAddress, // must match user's active address.
        gasPrice: setting.Ethereum.GasPrice, // customizable by user during MetaMask confirmation.
        gas: setting.Ethereum.GasLimit, // customizable by user during MetaMask confirmation.
        to: setting.Ethereum.ContractAddress, // Required except during contract publications.
        value: "0x00", // Only required to send ether to the recipient from the initiating external account.
        data: puppy, // Optional, but used for defining smart contract creation and interaction.
      };

      //console.log(parameters);
      // txHash is a hex string
      // As with any RPC call, it may throw an error
      const txHash = await ethereum.request({
        method: "eth_call",
        params: [parameters, "latest"],
      });

      const dog = web3.eth.abi.decodeParameters(
        ["string", "uint256", "uint8", "uint256", "uint256"],
        txHash
      );
      console.log(JSON.stringify(dog));
      setDog(JSON.stringify(dog));
    } catch (error) {
      console.log(error);
    }

    //const getDog = contract.methods.getPuppy(value.index).encodeABI();
    //setDog(getDog);
  };
  return (
    <div className="dog">
      <h2>Search dog</h2>
      <Formik
        initialValues={{
          index: "",
        }}
        onSubmit={onSubmit}
      >
        <Form className="mt-5">
          <BForm.Group>
            <BForm.Label className="d-block my-3">Index</BForm.Label>
            <Field
              id="index"
              name="index"
              placeholder=""
              className="d-block my-3 w-100"
            />
          </BForm.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Formik>
      <p></p>
      {dog ? (
        <div>
          <label>Name:</label>
          <label>DOB:</label>
          <label>Sex:</label>
          <label>Microchip:</label>
          <label>Dam ID:</label>
          <label>Sire ID:</label>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
