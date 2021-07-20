import app from "flarum/app";
import { extend } from "flarum/extend";
import PostUser from "flarum/components/PostUser";
import TerminalPost from "flarum/components/TerminalPost";
import Link from "flarum/components/Link";

app.initializers.add("mickmelon-coloured-usernames", () => {
  extend(PostUser.prototype, "view", function (vnode) {
    const user = this.attrs.post.user();
    if (!user) {
      return;
    }

    const colour = getColour(user);
    if (!colour) {
      return;
    }

    // Set the colour of the username class
    const username = vnode.children
      .find(matchTag("h3"))
      .children.find(matchTag(Link))
      .children.find(matchClass("username"));
    if (!username) {
      return;
    }

    setUsernameColour(username, colour);
  });

  extend(TerminalPost.prototype, "view", function (vnode) {
    const user = this.attrs.discussion.user();
    if (!user) {
      return;
    }

    console.log(user);

    const colour = getColour(user);
    if (!colour) {
      return;
    }

    const username = vnode.children[2].children[0];
    if (!username) {
      return;
    }

    setUsernameColour(username, colour);
  });
});

const getColour = (user) => {
  // Find the first group that has a color
  // We don't read badges because we would need to support every badge component and its attrs
  const colour = user.groups().find((group) => {
    return group.color();
  });
  return colour;
};

const matchTag = (tag) => {
  return (node) => node && node.tag && node.tag === tag;
};

const matchClass = (className) => {
  return (node) =>
    node &&
    node.attrs &&
    node.attrs.className &&
    (node.attrs.className === className ||
      node.attrs.className.includes(className));
};

const setUsernameColour = (username, colour) => {
  username.attrs = username.attrs || {};
  username.attrs.style = username.attrs.style || {};
  username.attrs.style.color = colour.color();
};
