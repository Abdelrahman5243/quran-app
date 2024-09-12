import { useDispatch, useSelector } from "react-redux";
import { setReader } from "../features/ayahsSlice";
import Selector from "./common/Selector";
import readers from "../staticData/readers";

const ReaderSelector = () => {
  const dispatch = useDispatch();
  const { reader } = useSelector((state) => state.ayahs);

  const handleReaderChange = (e) => {
    dispatch(setReader(e.target.value));
  };

  const options = readers.map((reader) => ({
    value: reader.code,
    label: reader.name,
  }));

  return (
    <Selector
      id="reader-select"
      value={reader}
      onChange={handleReaderChange}
      options={options}
      label="Select Reader"
      ariaLabel="Select Reader"
    />
  );
};

export default ReaderSelector;
