const KNOWN_PATTERNS = [
  ['画风', /korean manhwa|webtoon|韩漫/gi, '韩漫'],
  ['画风', /japanese anime|anime style|manga style|日漫|二次元/gi, '日漫'],
  ['画风', /photorealistic|photo-realistic|realistic photograph|写实摄影|真实摄影/gi, '写实摄影'],
  ['画风', /cinematic|电影感|电影摄影/gi, '电影感'],
  ['画风', /oil painting|油画|impasto/gi, '油画'],
  ['画风', /watercolou?r|水彩/gi, '水彩'],
  ['画风', /ink wash|sumi-e|水墨/gi, '水墨'],
  ['画风', /charcoal|炭笔|graphite|铅笔/gi, '炭笔铅笔'],
  ['画风', /crayon|蜡笔|doodle|涂鸦/gi, '蜡笔涂鸦'],
  ['画风', /ukiyo-e|浮世绘/gi, '浮世绘'],
  ['画风', /art nouveau|新艺术/gi, '新艺术'],
  ['画风', /surreal|超现实/gi, '超现实'],
  ['画风', /caravaggio|卡拉瓦乔/gi, '卡拉瓦乔式明暗'],
  ['画风', /academic atelier|academy study|学院派/gi, '学院派'],
  ['画风', /hong kong|港风|香港杂志/gi, '港风杂志'],
  ['画风', /candid|snapshot|抓拍/gi, '生活抓拍'],
  ['画风', /lo-fi|low quality|低画质/gi, '低保真'],
  ['镜头', /bird['’]?s-eye|top-down|overhead shot|俯拍|鸟瞰/gi, '俯拍鸟瞰'],
  ['镜头', /high[- ]angle|高角度/gi, '高角度'],
  ['镜头', /low[- ]angle|仰拍|低角度/gi, '低角度仰拍'],
  ['镜头', /dutch angle|荷兰角|倾斜构图/gi, '倾斜构图'],
  ['镜头', /close[- ]?up|close crop|特写|近景/gi, '特写近景'],
  ['镜头', /full[- ]body|全身/gi, '全身构图'],
  ['镜头', /medium shot|中景/gi, '中景'],
  ['镜头', /wide shot|long shot|远景|广角/gi, '远景广角'],
  ['镜头', /pov|point of view|第一人称|主观镜头/gi, '第一人称'],
  ['镜头', /85\s?mm/gi, '85mm'],
  ['镜头', /50\s?mm/gi, '50mm'],
  ['镜头', /35\s?mm/gi, '35mm'],
  ['镜头', /shallow depth of field|浅景深|bokeh|虚化/gi, '浅景深'],
  ['镜头', /vertical composition|portrait orientation|竖构图/gi, '竖构图'],
  ['镜头', /symmetrical|centered composition|对称|居中构图/gi, '居中对称'],
  ['镜头', /negative space|留白/gi, '留白'],
  ['镜头', /collage|scrapbook|拼贴|手账/gi, '拼贴手账'],
  ['镜头', /iphone|手机拍摄/gi, 'iPhone随拍'],
  ['镜头', /ccd|数码相机/gi, 'CCD数码感'],
  ['镜头', /instagram|社交主页/gi, '社交主页版式'],
  ['镜头', /16\s*:\s*9|3\s*:\s*2|4\s*:\s*3|9\s*:\s*16/gi, '画幅比例'],
  ['光线', /contre[- ]jour|backlight|逆光/gi, '逆光'],
  ['光线', /rim light|edge light|轮廓光/gi, '轮廓光'],
  ['光线', /low[- ]key|chiaroscuro|暗调|明暗法/gi, '暗调明暗法'],
  ['光线', /soft light|diffused light|柔光|漫射光/gi, '柔光'],
  ['光线', /golden hour|sunset light|黄金时刻|夕阳/gi, '黄金时刻'],
  ['光线', /moonlight|月光/gi, '月光'],
  ['光线', /neon|霓虹/gi, '霓虹光'],
  ['光线', /volumetric light|god rays|体积光/gi, '体积光'],
  ['氛围', /romantic|浪漫/gi, '浪漫'],
  ['氛围', /intimate|亲密/gi, '亲密'],
  ['氛围', /melanchol|忧郁|伤感/gi, '忧郁'],
  ['氛围', /quiet|serene|tranquil|安静|宁静/gi, '安静'],
  ['氛围', /dreamy|dreamlike|梦幻|梦境/gi, '梦境感'],
  ['氛围', /nostalgic|vintage|怀旧|复古/gi, '怀旧复古'],
  ['氛围', /mysterious|神秘/gi, '神秘'],
  ['背景', /window|窗边|窗户/gi, '窗边'],
  ['背景', /bedroom|bedside|卧室|床边/gi, '卧室'],
  ['背景', /cafe|coffee shop|咖啡馆/gi, '咖啡馆'],
  ['背景', /forest|woods|森林/gi, '森林'],
  ['背景', /garden|花园/gi, '花园'],
  ['背景', /ocean|sea|beach|海边|海滩/gi, '海边'],
  ['背景', /church|cathedral|教堂/gi, '教堂'],
  ['背景', /palace|宫殿/gi, '宫殿'],
  ['动作', /embrac|hug|拥抱/gi, '拥抱'],
  ['动作', /kiss|亲吻/gi, '亲吻'],
  ['动作', /looking at|gazing|凝视|看向/gi, '凝视'],
  ['动作', /sitting|seated|坐着|坐姿/gi, '坐姿'],
  ['动作', /standing|站立/gi, '站姿'],
  ['动作', /lying|reclining|躺|倚卧/gi, '躺卧'],
  ['材质', /film grain|grainy|胶片颗粒/gi, '胶片颗粒'],
  ['材质', /paper texture|textured paper|纸张纹理|纸感/gi, '纸张纹理'],
  ['材质', /brushstroke|brush stroke|笔触/gi, '可见笔触'],
  ['配色', /warm amber|amber|琥珀/gi, '暖琥珀'],
  ['配色', /deep blue|navy|深蓝/gi, '深蓝'],
  ['配色', /pastel|粉彩|低饱和/gi, '柔和低饱和'],
  ['配色', /monochrome|单色|黑白/gi, '单色'],
]

const STOPWORDS = new Set(`a an and are as at be beside by for from has have her his in into is it its of on or she he that the their them they this through to with without very highly style image picture scene view shot composition detailed detail featuring showing rendered realistic beautiful quality high ultra richly rich clean clearly emphasizing maximum throughout against around`.split(/\s+/))
const SLOT_FALLBACK = { style: '画风', character: '人设', outfit: '服装', pose: '姿势', expression: '表情', background: '背景', mood: '氛围', lighting: '光线', camera: '镜头', color: '配色', texture: '材质', avoid: '负向词' }
const SLOT_GROUP = { style: '画风', pose: '动作', background: '背景', mood: '氛围', lighting: '光线', camera: '镜头', color: '配色', texture: '材质' }

const unique = (items) => [...new Set(items.filter(Boolean))]

function originalTokens(text) {
  const english = (text.match(/[A-Za-z][A-Za-z'’-]{2,}/g) || [])
    .map((word) => word.replace(/[’]/g, "'").toLowerCase())
    .filter((word) => !STOPWORDS.has(word) && !/^ar$/.test(word))
  const counts = new Map()
  for (const word of english) counts.set(word, (counts.get(word) || 0) + 1)
  const rankedEnglish = [...counts].sort((a, b) => b[1] - a[1] || english.indexOf(a[0]) - english.indexOf(b[0])).map(([word]) => word)
  const chinese = (text.match(/[\u4e00-\u9fff]{2,10}/g) || []).filter((word) => !/构图|画面|细节|质感|效果/.test(word))
  return unique([...chinese.slice(0, 4), ...rankedEnglish.slice(0, 7)])
}

export function isUnclassifiedChoice(choice) {
  return /未定义|未归类|undefined|null/i.test(`${choice?.label || ''} ${choice?.major || ''} ${choice?.minor || ''}`)
}

export function summarizePromptText(text, slot = '') {
  const source = String(text || '').replace(/[(){}\[\]<>]/g, ' ').replace(/\s+/g, ' ').trim()
  const recognized = []
  for (const [group, pattern, label] of KNOWN_PATTERNS) {
    pattern.lastIndex = 0
    if (pattern.test(source)) recognized.push({ group, label })
  }
  const preferredGroup = SLOT_GROUP[slot]
  recognized.sort((a, b) => Number(b.group === preferredGroup) - Number(a.group === preferredGroup))
  const original = originalTokens(source)
  const labels = unique(recognized.map((item) => item.label))
  const keywords = unique([...labels, ...original]).slice(0, 9)
  if (!keywords.length) keywords.push('原文为空')
  return {
    title: (keywords.slice(0, 3).join(' · ') || `${SLOT_FALLBACK[slot] || '原文'}关键词`),
    keywords,
    recognized,
    searchText: `${source} ${keywords.join(' ')}`.toLowerCase(),
  }
}

export function summarizePromptChoice(choice, slot = '') {
  const cleanLabel = String(choice?.label || '').replace(/未(?:定义|归类)[^·\s]*/g, '').replace(/[·]+/g, ' ')
  const summary = summarizePromptText(`${choice?.en || ''} ${cleanLabel}`, slot)
  return { ...summary, unclassified: isUnclassifiedChoice(choice) }
}
