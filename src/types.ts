export interface Task {
  _id: string;
  title: string;
  description: string;
  user: {
    _id: string;
    name: string;
  };
}
