import { Button, Flex, Space, Typography } from "antd";
import { Link } from "react-router-dom";
import { GithubFilled } from "@ant-design/icons";
import styles from "./index.module.scss";
import useStore from "@/store";

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  const setHeaderMenuCur = useStore((state) => state.setHeaderMenuCur);
  return (
    <div className={styles.home}>
      <img
        style={{ height: "15em", marginBottom: "1em" }}
        src="/favicon.ico"
      ></img>
      <Title className={styles.title}>TrackPoint Platform</Title>
      <Paragraph>帮助团队打造一个优质软件产品</Paragraph>
      <Flex gap={"1em"}>
        <Button>
          <Link to="https://github.com/mr8eight/TrackPoint" target="_blank">
            <Space>
              Github
              <GithubFilled />
            </Space>
          </Link>
        </Button>
        <Button type="primary">
          <Link onClick={() => setHeaderMenuCur("event")} to="/action/event">
            立即开始
          </Link>
        </Button>
      </Flex>
    </div>
  );
};

export default Home;
