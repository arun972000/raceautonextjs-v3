"use client";
import { Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { MdDelete, MdModeEdit } from "react-icons/md";
import { toast } from "react-toastify";
import Link from "next/link";
import { SubscriptionType } from "@/types/subscription";
import PlanForm from "./createList";

const SubscriptionTable = () => {
  const [data, setData] = useState([]);
  const [priceData, setPriceData] = useState([]);

  const tableData = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/admin/subscription`
      );
      const onlyData = res.data.filter(
        (item: SubscriptionType) =>
          item.plan !== "Monthly price" && item.plan !== "Annual price"
      );
      const onlyPrice = res.data.filter(
        (item: SubscriptionType) =>
          item.plan === "Monthly price" || item.plan === "Annual price" || item.plan === "usd"
      );

      setData(onlyData);
      setPriceData(onlyPrice);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id: any) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/admin/subscription/${id}`
      );
      tableData();
      toast.success("Deleted successfully!", {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (err) {
      console.log(err);
      toast.warn("Error deleting the item. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    tableData();
  }, []);

  return (
    <div className="col-12">
      <div className="shadow-sm p-3 mb-5 mt-5 bg-white rounded border-0">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Plan</th>
              <th>Platinum</th>
              <th>Gold</th>
              <th>Silver</th>
              <th>Bronze</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {[...data, ...priceData].map((item: SubscriptionType) => (
              <tr key={item.id}>
                <td>{item.plan}</td>
                <td>{item.platinum}</td>
                <td>{item.gold}</td>
                <td>{item.silver}</td>
                <td>{item.bronze}</td>
                <td>
                  <div className="d-flex">

                      <Link href={`/admin/subscription/${item.id}`}>
                        <button className="btn btn-primary me-3">
                          <MdModeEdit size={20} />
                        </button>
                      </Link>

                    {item.plan !== "Monthly price" && item.plan !== "Annual price" && item.plan !== "usd" && (
                      <button
                        className="btn btn-danger me-3"
                        onClick={() => handleDelete(item.id)}
                      >
                        <MdDelete size={20} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            <PlanForm tableData={tableData} />
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default SubscriptionTable;
