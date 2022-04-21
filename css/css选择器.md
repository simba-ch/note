# css选择器
### [attribute^=value] 与 [attribute|=value]
* [attribute^=value]：C3中的选择器，a[src^="https"]，选择每一个src属性的值以"https"开头的元素，https可以是一个单词（效果同a[src|="https"]），也可以是一个单词的开始几个字符
* [attribute|=value]：C2中的选择器，[lang|=en]，选择 lang 属性以 en 为开头的所有元素，选择第一个单词为“en”的元素，注意：“en”为整个单词（但后面可以用“-”连接其他字符串）

### [attribute*=value] 与 [attribute~=value]
* [attribute*=value]：C3中的选择器，选择每一个属性的值包含子字符串"value"的元素
* [attribute~=value]：C2中的选择器，选择每一个属性的值包含单词"value"的所有元素
* :lang(language)：C2中的选择器,p:lang(it),选择一个lang属性的起始值="it"的所有<p>元素,等于[lang|=language]，是针对lang的选择器

### element1+element2 与 element1~element2：都是nextSiblings选择器
* element1+element2：C2中的选择器，div+p，选择所有紧接着<div>元素之后的<p>元素
* element1~element2：C3中的选择器，p~ul，选择p元素之后的每一个ul元素

### :only-of-type 与 :only-child
* :only-of-type：C3中的选择器，p:only-of-type，选择每个p元素是其父级的唯一p元素。p元素的父级有且只有一个p元素，可以有其他子元素
* :only-child：C3中的选择器，p:only-child，选择每个p元素是其父级的唯一子元素。p元素的父级只有一个子元素，且该子元素为p元素

### :empty
* :empty：C3中的选择器，p:empty，选择每个没有任何子级的p元素（包括文本节点）

### :target（一个很有意思的选择器）
* :target：C3中的选择器，#news:target，选择当前活动的#news元素（包含该锚名称的点击的URL）

### ::selection（没啥用的选择器）
::selection选择器匹配元素中被用户选中或处于高亮状态的部分。
::selection只可以应用于少数的CSS属性：color, background, cursor,和outline。

