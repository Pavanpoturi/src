import { Divider, Tag } from "antd";
import { useState } from "react";

const { CheckableTag } = Tag;

export default function HotTags({ tagsData, name, checkedData, checked }) {
  const [selectedTag, setSelectedTag] = useState();

  const handleChange = (tag, checked, name) => {
    if (checked) {
      setSelectedTag(tag);
      let obj = { type: name, tag: tag };
      checkedData(obj);
    }
  };

  return (
    <>
      <span style={{ marginRight: 8 }}>
        <strong>{name}:</strong>
      </span>
      {tagsData?.map((tag) => (
        <CheckableTag
          key={tag}
          checked={selectedTag?.indexOf(tag) > -1 || checked === tag}
          onChange={(checked) => handleChange(tag, checked, name)}
        >
          <strong>{tag}</strong>
        </CheckableTag>
      ))}
      <Divider />
    </>
  );
}
