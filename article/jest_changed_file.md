# Jest CLI: 如何执行相关文件的测试用例

> 2020 11 29

在完成了某个功能改动之后，提交代码时，往往需要执行一遍测试用例。如果每次都把整个项目的测试用例跑一遍，实在是费时费力。那么，如何只执行部分相关文件的测试用例呢？

其实 Jest CLI 工具已经为我们提供了一些相关选项，所以我们就来看一看，它们有什么效果与区别：

- `--onlyChanged`
- `--lastCommit`
- `--changedSince`
- `--changedFilesWithAncestor`

## Git 项目初始状态：

我对项目中有三个文件进行了修改：

- committed.js
- staged.js
- changed.js

其中 `committed.js` 文件已经提交（通过 `git commit` 命令）。
![项目初始文件](https://raw.githubusercontent.com/zhang-quan-yi/blogs/master/resource/jest_cli_file_intro_1.png)

`staged.js` 文件已经加入暂存区（通过 `git add` 命令）。
`changed.js` 文件内容做了修改，并没有应用 `git` 命令。
![项目初始文件](https://raw.githubusercontent.com/zhang-quan-yi/blogs/master/resource/jest_cli_file_intro_2.png)

## `--onlyChanged`

该选项会匹配当前项目中已经修改过的文件。
执行 `jest --onlyChanged` 命令，会有如下效果：
![onlyChanged 执行结果](https://raw.githubusercontent.com/zhang-quan-yi/blogs/master/resource/jest_cli_only_changed.png)
可以看到，只匹配到了 `changed.js` 文件，加入到暂存区的文件是无法匹配到的。

## --lastCommit

匹配上一次 commit 的文件；
执行 `jest --lastCommit` 命令，会有如下效果：
![lastCommit 执行结果](https://raw.githubusercontent.com/zhang-quan-yi/blogs/master/resource/jest_cli_lastCommit.png)
可以看到，匹配到了 `committed.js` 文件。

## changedSince

该选项需要提供一个提交点作为参考值，该参考点以后的所有改动的文件都会被匹配到。
