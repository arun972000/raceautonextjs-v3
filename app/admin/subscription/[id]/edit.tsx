"use client";
/* eslint-disable react-hooks/exhaustive-deps */

import { Form, Button, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "next/navigation";
import Link from "next/link";

const EditPlan = () => {
  const { id } = useParams();
  const [planName, setPlanName] = useState("");
  const [planTypes, setPlanTypes] = useState<any>({
    platinum: false,
    gold: false,
    silver: false,
    bronze: false,
  });

  const handleInputChange = (e: any) => {
    const { value, checked, type } = e.target;
    if (type === "checkbox") {
      setPlanTypes((prevPlanTypes: any) => ({
        ...prevPlanTypes,
        [value]: checked,
      }));
    } else {
      setPlanName(value);
    }
  };

  const TableData = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/admin/subscription/${id}`
      );
      setPlanTypes({
        ...planTypes,
        platinum: res.data[0].platinum,
        gold: res.data[0].gold,
        silver: res.data[0].silver,
        bronze: res.data[0].bronze,
      });
      setPlanName(res.data[0].plan);
    } catch (err) {
      console.log(err);
    }
  };

  const updateTable = async () => {
    const formdata = { ...planTypes, plan: planName };
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/admin/subscription/${id}`,
        formdata
      );
      toast.success("updated!", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (err) {
      console.log(err);
      toast.warn(
        "An error occurred while submitting the form. Please try again later.",
        {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    updateTable();
  };

  useEffect(() => {
    TableData();
  }, [id]);

  return (
    <>
      <div className="col-12">
        <div className="shadow-sm p-3 mb-5 rounded border-0">
          <Link href="/admin/subscription">
            <button className="btn btn-primary my-3">Back</button>
          </Link>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Plan</th>
                <th>Platinum</th>
                <th>Gold</th>
                <th>Silver</th>
                <th>Bronze</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>-</td>
                <td>
                  <Form.Group controlId="formPlanName">
                    <Form.Control
                      type="text"
                      placeholder="Plan Name"
                      value={planName}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </td>
                {planName !== "Monthly price" && planName !== "Annual price" && planName !=="usd" ? (
                  <>
                    <td>
                      <Form.Check
                        type="checkbox"
                        name="planType"
                        value="platinum"
                        checked={planTypes.platinum}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <Form.Check
                        type="checkbox"
                        name="planType"
                        value="gold"
                        checked={planTypes.gold}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <Form.Check
                        type="checkbox"
                        name="planType"
                        value="silver"
                        checked={planTypes.silver}
                        onChange={handleInputChange}
                      />
                    </td>
                    <td>
                      <Form.Check
                        type="checkbox"
                        name="planType"
                        value="bronze"
                        checked={planTypes.bronze}
                        onChange={handleInputChange}
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td>
                      <Form.Group controlId="formPlanName">
                        <Form.Control
                          type="text"
                          placeholder="Platinum"
                          value={planTypes.platinum}
                          onChange={(e) =>
                            setPlanTypes({
                              ...planTypes,
                              platinum: e.target.value,
                            })
                          }
                        />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group controlId="formPlanName">
                        <Form.Control
                          type="text"
                          placeholder="Gold"
                          value={planTypes.gold}
                          onChange={(e) =>
                            setPlanTypes({ ...planTypes, gold: e.target.value })
                          }
                        />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group controlId="formPlanName">
                        <Form.Control
                          type="text"
                          placeholder="silver"
                          value={planTypes.silver}
                          onChange={(e) =>
                            setPlanTypes({
                              ...planTypes,
                              silver: e.target.value,
                            })
                          }
                        />
                      </Form.Group>
                    </td>
                    <td>
                      <Form.Group controlId="formPlanName">
                        <Form.Control
                          type="text"
                          placeholder="bronze"
                          value={planTypes.bronze}
                          onChange={(e) =>
                            setPlanTypes({
                              ...planTypes,
                              bronze: e.target.value,
                            })
                          }
                        />
                      </Form.Group>
                    </td>
                  </>
                )}
                <td>
                  <Form.Group>
                    <Button onClick={handleSubmit}>Submit</Button>
                  </Form.Group>
                </td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default EditPlan;
