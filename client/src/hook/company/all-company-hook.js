import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllCompany } from "../../Redux/actions/companyAction";

const AllCompanyHook = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    dispatch(getAllCompany());
    setLoading(false);
  }, []);
  const resCompany = useSelector((state) => state.companyReducer.allCompany);

  let allCompany = [];

  try {
    if (resCompany.data) allCompany = resCompany.data;
    else allCompany = [];
  } catch (e) {}

  return [allCompany];
};

export default AllCompanyHook;
