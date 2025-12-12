import { Modal, Form, Input, InputNumber, Select, Image } from 'antd';
import { useEffect } from 'react';

export default function EditBook(props) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (props.isOpen && props.item) {
      form.setFieldsValue(props.item);
    }
  }, [props.isOpen, props.item, form]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        props.onSave(values);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="Edit Book"
      open={props.isOpen}
      onOk={handleOk}
      onCancel={props.onCancel}
    >
      {props.item?.coverUrl && (
        <div style={{ marginBottom: 16 }}>
          <Image 
            src={`http://localhost:3080/${props.item.coverUrl}`} 
            height={120} 
            width={85} 
            style={{ objectFit: 'cover', borderRadius: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} 
          />
        </div>
      )}
      
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
      >
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: 'Please input the title of collection!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="author" label="Author" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="price" label="Price" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="stock" label="Stock" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="categoryId" label="Category" rules={[{ required: true }]}>
           <Select allowClear options={props.categories}/>
        </Form.Item>
      </Form>
    </Modal>
  );
}
