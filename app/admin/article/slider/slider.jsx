'use client'
/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Form, FormControl, Table } from "react-bootstrap";
import { FaSave } from "react-icons/fa";
import Link from "next/link";


const SliderArticles = () => {

    const [data, setData] = useState([]);
    const [orderValues, setOrderValues] = useState({});

    const [selectedOption, setSelectedOption] = useState(1);

    const handleOptionChange = (e) => {
        setSelectedOption(e.target.value);
    };

    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const monthIndex = date.getMonth();
        const month = months[monthIndex];
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month} ${day}, ${year}`;
    };

    const handleOrderChange = async (id, newValue) => {
        setOrderValues((prevValues) => ({
            ...prevValues,
            [id]: newValue,
        }));

        try {
            await axios.put(
                `${process.env.BACKEND_URL}api/admin/post/update-order/${id}`,
                {
                    order_values: newValue,
                    postType: 'is_slider',
                },
            );
        } catch (err) {
            console.log(err);
        }
    };

    const sliderApi = async () => {
        try {
            const res = await axios.get(
                `${process.env.BACKEND_URL}api/admin/post/slider`, 
            );
            setSelectedOption(res.data[0].slider_type);
        } catch (err) {
            console.log(err);
        }
    };

    const SliderChangeApi = async () => {
        try {
            await axios.put(
                `${process.env.BACKEND_URL}api/admin/post/slider`,
                {
                    slider_type: selectedOption,
                }
            );
        } catch (err) {
            console.log(err);
        }
    };

    const SliderChange = () => {
        SliderChangeApi();
    };




    const handlePostType = async () => {
        try {
            const res = await axios.get(
                `${process.env.BACKEND_URL
                }api/admin/post/is_slider`,
            );
            setData(res.data);
            const initialOrderValues = {};
            res.data.forEach((item) => {
                initialOrderValues[item.id] =

                    item.slider_order;
            });
            setOrderValues(initialOrderValues);
        } catch (err) {
            console.log(err)
        }
    }


  

    useEffect(() => {
        handlePostType()
        sliderApi()
    }, [])
    return (
        <>
           
            {/* <div className="d-flex">
                <h6>Slider Type</h6>
                <Form.Check
                    type="radio"
                    label="Option 1"
                    name="options"
                    id="option1"
                    value={1}
                    className="mx-2"
                    checked={selectedOption == 1}
                    onChange={handleOptionChange}
                />
                <Form.Check
                    type="radio"
                    label="Option 2"
                    name="options"
                    id="option2"
                    value={2}
                    className="mx-2"
                    checked={selectedOption == 2}
                    onChange={handleOptionChange}
                />
                <Form.Check
                    type="radio"
                    label="Option 3"
                    name="options"
                    id="option3"
                    value={3}
                    className="mx-2"
                    checked={selectedOption == 3}
                    onChange={handleOptionChange}
                />
                <Button variant="primary" onClick={SliderChange}>
                    <FaSave />
                </Button>
            </div> */}
            <div className="container-fluid mt-4">
                <Table className="text-center">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Post</th>
                            <th>Category</th>
                            <th>Author</th>
                            <th>Pageviews</th>
                            <th>Order</th>
                            <th>Posted Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id}>

                                <td>{item.id}</td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <Link className="link-style" href={`/post/${item.title_slug}`}>
                                            <img
                                                src={`${process.env.BACKEND_URL}${item.image_small
                                                    }`}
                                                className="image-fluid"
                                                style={{ width: 80 }}
                                                alt={item.id}
                                            ></img>
                                        </Link>
                                        <p className="ms-3 text-small p-0 m-0">{item.title}</p>

                                    </div>
                                    <div>
                                        {item.is_slider == 1 && <span className='mx-1' style={{
                                            backgroundColor: "brown",
                                            borderRadius: 25,
                                            fontSize: 11,
                                            padding: 5,
                                            fontWeight: 700,
                                            color: "white",
                                        }}>Slider</span>}
                                        {item.is_featured == 1 && <span className='mx-1' style={{
                                            backgroundColor: "grey",
                                            borderRadius: 25,
                                            fontSize: 11,
                                            padding: 5,
                                            fontWeight: 700,
                                            color: "white",
                                        }}>featured</span>}
                                        {item.is_breaking == 1 && <span className='mx-1' style={{
                                            backgroundColor: "red",
                                            borderRadius: 25,
                                            fontSize: 11,
                                            padding: 5,
                                            fontWeight: 700,
                                            color: "white",
                                        }}>Breaking</span>}
                                        {item.is_recommended == 1 && <span className='mx-1' style={{
                                            backgroundColor: "green",
                                            borderRadius: 25,
                                            fontSize: 11,
                                            padding: 5,
                                            fontWeight: 700,
                                            color: "white",
                                        }}>Popular</span>}
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex table-badge flex-column">
                                        <p
                                            className="text-small px-2 mb-3"
                                            style={{
                                                backgroundColor: item.color,
                                                borderRadius: 25,
                                                fontSize: 11,
                                                fontWeight: 700,
                                                color: "white",
                                            }}
                                        >
                                            {item.main_category}

                                        </p>
                                        <p
                                            className="text-small px-2 "
                                            style={{
                                                backgroundColor: item.color,
                                                borderRadius: 25,
                                                fontSize: 11,
                                                fontWeight: 700,
                                                color: "white",
                                            }}
                                        >
                                            {item.sub_category}
                                        </p>
                                    </div>
                                </td>
                                <td>{item.username}</td>
                                <td>{item.pageviews}</td>
                                <td>
                                    <FormControl
                                        type="number"
                                        value={orderValues[item.id] || ""}
                                        onChange={(e) =>
                                            handleOrderChange(item.id, e.target.value)
                                        }
                                    />
                                </td>
                                <td>{formatDate(item.created_at)}</td>
                        
                            </tr>
                        ))}
                    </tbody>
                </Table>

            </div>
        </>
    )
}

export default SliderArticles