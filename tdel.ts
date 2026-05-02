import fs from "node:fs";
import path from "node:path";

/**
 * 递归删除指定目录下所有名为 'dist' 的文件夹
 * @param {string} dir 起始目录路径
 */
function deleteAllDist(dir: string) {
	// 读取目录内容
	let entries: fs.Dirent[];
	try {
		entries = fs.readdirSync(dir, { withFileTypes: true });
	} catch (err: any) {
		// 如果目录无法访问（权限、不存在等），静默跳过或输出错误
		console.error(`无法读取目录 ${dir}:`, err.message);
		return;
	}

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		// 如果是目录，才进一步处理
		if (entry.isDirectory()) {
			// 遇到 node_modules 则完全跳过（不进入，也不删除其中的 dist）
			if (entry.name === "node_modules") {
				console.log(`跳过目录: ${fullPath}`);
				continue;
			}

			// 如果当前子目录名为 dist，则删除整个 dist 文件夹
			const arr = ["dist", "types", ".turbo"]; // 可以根据需要添加更多的目录名
			if (arr.includes(entry.name)) {
				try {
					fs.rmSync(fullPath, { recursive: true, force: true });
					console.log(`已删除: ${fullPath}`);
				} catch (err: any) {
					console.error(`删除失败 ${fullPath}:`, err.message);
				}
			} else {
				// 否则递归进入该子目录继续查找
				deleteAllDist(fullPath);
			}
		}
	}
}

// 从当前工作目录开始执行
const startDir = process.cwd();
console.log(`开始扫描: ${startDir}`);
deleteAllDist(startDir);
console.log("操作完成");
