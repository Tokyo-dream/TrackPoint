import { Button, Table, Typography, Empty, message } from "antd";
import { ExclamationCircleOutlined, SearchOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import { useState, useEffect } from "react";
import axios from "axios";
import { PanelFilter, SelectFilter } from "@/commons/Filter";
import type { PanelFilterItems } from "@/commons/Filter";
import { urlOptions, errorOptions } from "@/data";

const { Text } = Typography;

interface DataType {
  key: string;
  url?: string;
  type?: string;
  time?: string;
  message: string;
}

const AlertButton = ({ record }: { record: DataType }) => {
  const handleAlert = () => {
    axios
      .post("/api/send-alert", { errorKey: record.key })
      .then(() => {
        message.success("报警通知已发送");
      })
      .catch(() => {
        message.error("报警通知发送失败");
      });
  };

  return (
    <Button type="primary" onClick={handleAlert}>
      报警
      <ExclamationCircleOutlined />
    </Button>
  );
};

const columns: TableProps<DataType>["columns"] = [
  {
    title: "URL",
    dataIndex: "url",
    key: "url",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Time",
    dataIndex: "time",
    key: "time",
  },
  {
    title: "Message",
    dataIndex: "message",
    key: "message",
  },
  {
    title: "Action",
    key: "action",
    render: (_: any, record: DataType) => <AlertButton record={record} />,
  },
];

const initialData: DataType[] = [
  {
    key: "1",
    url: "http://example.com",
    type: "JS Error",
    time: "2025-02-23 10:00:00",
    message: "Uncaught TypeError in app.js",
  },
  {
    key: "2",
    url: "http://example.com",
    type: "API Error",
    time: "2025-02-23 10:05:00",
    message: "500 Internal Server Error",
  },
  {
    key: "3",
    url: "http://example.com/assets",
    type: "Resource Error",
    time: "2025-02-23 10:10:00",
    message: "404 Not Found",
  },
];

const items: PanelFilterItems[] = [
  {
    label: "url选择：",
    name: "urls",
    item: <SelectFilter options={urlOptions} />,
  },
  {
    label: "异常类型选择：",
    name: "types",
    item: <SelectFilter options={errorOptions} />,
    button: {
      type: "submit",
      item: (
        <Button type="primary" icon={<SearchOutlined />} iconPosition="end">
          查询
        </Button>
      ),
    },
  },
];

const Exception = () => {
  const [data, setData] = useState<DataType[]>(initialData);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 1 });
  const [filters, setFilters] = useState<Record<string, any>>({});

  useEffect(() => {
    //检查filters是否为空 如果为空则不请求
    if (Object.keys(filters).length > 0) {
      console.log(filters);
      fetchErrors(filters);
    }
  }, [filters, pagination]);

  const fetchErrors = async (params: any) => {
    try {
      const requestParams = {
        ...params,
        urls: params.urls?.join(","),
        types: params.types?.join(","),
        startTime: params.startTime || "2025-02-15 00:00:00",
        endTime: params.endTime || "2025-02-15 23:59:59",
        page: pagination.current,
        pageSize: pagination.pageSize,
      };
      const { data } = await axios.post(
        "/tracking/errorMonitor",
        requestParams
      );
      setData(data.data.list);
      message.success(data.message);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("查询失败，请稍后重试");
    }
  };

  const handleTableChange = (pag: any) => {
    setPagination({
      current: pag.current,
      pageSize: pag.pageSize,
    });
  };

  const onSubmit = (values: any) => {
    const msg = [];
    if (!values?.urls) {
      msg.push("请选择url！");
    }
    if (!values?.types) {
      msg.push("请选择异常类型！");
    }
    if (msg.length > 0) {
      while (msg.length > 0) {
        message.error(msg.shift());
      }
    } else {
      setFilters(values);
    }
  };
  return (
    <>
      <Text style={{ fontSize: "2em" }}>异常分析</Text>
      <PanelFilter items={items} onSubmit={onSubmit} />

      <Table
        columns={columns}
        dataSource={data}
        rowKey="key"
        bordered
        scroll={{ x: true }}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          showSizeChanger: true,
          pageSizeOptions: ["1", "2", "3"],
          showTotal: (total) => `共 ${total} 条`,
        }}
        onChange={handleTableChange}
        locale={{
          emptyText: (
            <Empty
              style={{ width: "100%" }}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
      />
    </>
  );
};

export default Exception;
