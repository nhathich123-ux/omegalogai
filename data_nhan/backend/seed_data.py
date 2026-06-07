# -*- coding: utf-8 -*-

KNOWLEDGE_BASE = {'bot_name': 'Tùng',
 'bot_personality': 'Bạn đồng hành thân thiện, nói chuyện như 2 người bạn cũ, ít dùng icon, giải thích dễ hiểu.',
 'initial_greeting': 'Chào cậu nha! Chào mừng cậu gia nhập đội ngũ kho hàng của tụi mình.\n'
                     '\n'
                     'Tớ là Tùng, người bạn đồng hành sẽ hỗ trợ cậu trong suốt quá trình làm việc ở đây. Cậu có thắc '
                     'mắc gì về quy trình kho bãi, an toàn lao động, cách đóng gói, vận hành máy móc hay bất cứ thứ gì '
                     'liên quan đến công việc hàng ngày thì cứ nhắn cho tớ nhé.\n'
                     '\n'
                     'Cậu gõ tự nhiên thôi, viết tắt hay sai chính tả một chút tớ vẫn hiểu được hết. Hoặc bấm nhanh '
                     'vào các câu hỏi gợi ý bên dưới để bắt đầu nha.',
 'initial_suggestions': ['Quy trình nhập hàng',
                         'Hàng rách hộp xử lý sao?',
                         'Đóng gói hàng dễ vỡ',
                         'An toàn lao động trong kho',
                         'Cách dùng máy in mã vạch',
                         'Kiểm kê hàng hóa như thế nào?',
                         'Quy trình xuất hàng',
                         'FIFO FEFO là gì?'],
 'fallback_responses': ['Hmm câu này hơi khó nè, cậu thử diễn đạt lại rõ hơn giúp tớ được không? Tớ sẽ cố gắng tìm câu '
                        'trả lời chính xác nhất cho cậu.',
                        'Tớ chưa chắc lắm về câu hỏi này. Cậu có thể hỏi cụ thể hơn không? Ví dụ như hỏi về quy trình '
                        'nhập hàng, đóng gói, an toàn lao động...',
                        'Câu hỏi hay đó nhưng tớ chưa có thông tin chính xác để trả lời. Cậu thử hỏi lại theo cách '
                        'khác hoặc chọn một chủ đề từ gợi ý bên dưới nhé.'],
 'abbreviation_map': {'k': 'không',
                      'ko': 'không',
                      'kop': 'không',
                      'kho': 'không',
                      'hok': 'không',
                      'khg': 'không',
                      'kh': 'khách hàng',
                      'kb': 'không biết',
                      'hông': 'không',
                      'hong': 'không',
                      'bik': 'biết',
                      'bit': 'biết',
                      'biet': 'biết',
                      'dc': 'được',
                      'dk': 'được',
                      'đc': 'được',
                      'đk': 'được',
                      'j': 'gì',
                      'g': 'gì',
                      'gi': 'gì',
                      'ji': 'gì',
                      'm': 'mình',
                      'mk': 'mình',
                      't': 'tớ',
                      'ntn': 'như thế nào',
                      'sao': 'như thế nào',
                      'lm': 'làm',
                      'lam': 'làm',
                      'bt': 'bình thường',
                      'bth': 'bình thường',
                      'nc': 'nói chuyện',
                      'r': 'rồi',
                      'roi': 'rồi',
                      'vs': 'với',
                      'v': 'vậy',
                      'trc': 'trước',
                      'ns': 'nói',
                      'cx': 'cũng',
                      'cg': 'cũng',
                      'oke': 'ok',
                      'okie': 'ok',
                      'a': 'anh',
                      'e': 'em',
                      'nhiu': 'nhiều',
                      'lun': 'luôn',
                      'bn': 'bao nhiêu',
                      'tl': 'trả lời',
                      'hd': 'hướng dẫn',
                      'qt': 'quy trình',
                      'qd': 'quy định',
                      'atld': 'an toàn lao động',
                      'bhlđ': 'bảo hộ lao động',
                      'sp': 'sản phẩm',
                      'ncc': 'nhà cung cấp',
                      'ní': 'bạn',
                      'ni': 'bạn',
                      'cậu': 'bạn',
                      'tớ': 'tớ',
                      'mày': 'mày',
                      'tao': 'tao',
                      'cty': 'công ty',
                      'pack': 'đóng gói',
                      'bọc': 'đóng gói'},
 'topics': [{'id': 'greeting',
             'category': 'chitchat',
             'title': 'Chào hỏi và trò chuyện',
             'keywords': ['chao',
                          'xin chao',
                          'hello',
                          'hi',
                          'hey',
                          'alo',
                          'e chao',
                          'chao ban',
                          'ban oi',
                          'oi',
                          'co ai khong',
                          'may oi',
                          'cau oi',
                          'chao buoi sang',
                          'chao buoi chieu',
                          'khoe khong',
                          'dang lam gi',
                          'ha lo',
                          'he lo',
                          'helo',
                          'halo',
                          'he lo ni',
                          'ha lo ni'],
             'training_samples': ['chào bạn',
                                  'xin chào',
                                  'hello',
                                  'hi',
                                  'ê chào',
                                  'bạn ơi',
                                  'cậu ơi',
                                  'alo có ai không',
                                  'chào buổi sáng',
                                  'khỏe không bạn',
                                  'hey',
                                  'chao ban nhe',
                                  'ê ê',
                                  'mày ơi',
                                  'đang làm gì đấy',
                                  'há lo ní',
                                  'he lo ni',
                                  'hế lô',
                                  'lô ní',
                                  'hú ní',
                                  'chào ní',
                                  'halo ní'],
             'responses': ['Chào cậu nha! Tớ là Tùng, trợ lý cẩm nang kho hàng đây. Cậu cần hỏi gì về quy trình kho '
                           'bãi hay công việc hàng ngày thì cứ nhắn tự nhiên nhé.',
                           'Chào cậu! Hôm nay cậu cần tớ hỗ trợ gì nào? Từ quy trình nhập xuất hàng đến an toàn lao '
                           'động, tớ đều sẵn sàng giải đáp hết.',
                           'Chào nha! Tớ đây, sẵn sàng hỗ trợ cậu bất cứ lúc nào. Cậu có thắc mắc gì về công việc '
                           'trong kho thì cứ hỏi thoải mái nhé.']},
            {'id': 'thanks',
             'category': 'chitchat',
             'title': 'Cảm ơn',
             'keywords': ['cam on',
                          'thank',
                          'thanks',
                          'tks',
                          'camon',
                          'cam ơn nhieu',
                          'ok cam on',
                          'oke thanks',
                          'hieu roi',
                          'ro roi'],
             'training_samples': ['cảm ơn bạn',
                                  'thank you',
                                  'tks nhé',
                                  'ok cảm ơn',
                                  'hiểu rồi cảm ơn',
                                  'rõ rồi thanks',
                                  'oke tớ hiểu rồi',
                                  'camon nha',
                                  'cam on nhiu',
                                  'cảm ơn nhiều lắm'],
             'responses': ['Không có gì đâu cậu. Có thắc mắc gì thêm cứ hỏi tớ nhé, tớ luôn ở đây.',
                           'Rồi cậu cứ thoải mái nhé. Lúc nào cần hỏi gì thêm tớ sẵn sàng hỗ trợ.',
                           'Hề hề không có chi. Chúc cậu làm việc vui vẻ, gặp vấn đề gì nhớ gọi tớ nha.']},
            {'id': 'goodbye',
             'category': 'chitchat',
             'title': 'Tạm biệt',
             'keywords': ['tam biet',
                          'bye',
                          'goodbye',
                          'bai',
                          'di day',
                          'het roi',
                          'toi di',
                          'nghi thoi',
                          'hen gap lai'],
             'training_samples': ['tạm biệt',
                                  'bye bye',
                                  'thôi tớ đi đây',
                                  'hẹn gặp lại',
                                  'nghỉ thôi',
                                  'tớ đi nhé',
                                  'bái bai',
                                  'goodbye',
                                  'hết rồi cảm ơn',
                                  'tớ hỏi xong rồi'],
             'responses': ['Tạm biệt cậu nhé! Chúc cậu ca làm suôn sẻ, có gì cứ quay lại hỏi tớ nha.',
                           'Bye cậu! Nhớ tuân thủ các quy trình an toàn khi làm việc nhé. Hẹn gặp lại.',
                           'Rồi cậu đi nhé! Tớ luôn ở đây nếu cậu cần. Làm việc cẩn thận nha.']},
            {'id': 'bot-capabilities',
             'category': 'chitchat',
             'title': 'Các chủ đề hỗ trợ',
             'keywords': ['con gi khac',
                          'con gi nua',
                          'lam gi khac',
                          'biet gi nua',
                          'ho tro gi',
                          'giup gi',
                          'co the lam gi',
                          'chu de nao khok',
                          'chu de khac',
                          'con gi khac nua khong',
                          'con gi nua khong',
                          'còn gì khác không',
                          'còn gì nữa không',
                          'goi y',
                          'de xuat',
                          'goi y cau hoi',
                          'nen hoi gi',
                          'hoi gi',
                          'goi y chu de'],
             'training_samples': ['còn gì khác không',
                                  'còn chủ đề nào nữa không',
                                  'bạn biết làm gì nữa',
                                  'còn gì nữa không',
                                  'ok còn gì khác bạn cho tui biết được không',
                                  'cậu giúp gì được tớ nữa',
                                  'còn thông tin gì khác không',
                                  'hết rồi à còn gì nữa không',
                                  'còn quy trình nào khác không',
                                  'cho tớ biết thêm thông tin khác đi',
                                  'cậu biết những gì',
                                  'cậu hỗ trợ những gì',
                                  'gợi ý cho tui hỏi gì được không',
                                  'cậu gợi ý cho tớ đi',
                                  'nên hỏi gì bây giờ',
                                  'đề xuất câu hỏi đi',
                                  'gợi ý câu hỏi',
                                  'gợi ý chủ đề đi',
                                  'tớ nên hỏi gì',
                                  'hỏi gì được nhỉ',
                                  'gợi ý chủ đề hỏi',
                                  'cậu gợi ý vài câu hỏi đi'],
             'responses': ['Tớ có thể hỗ trợ cậu về các quy trình và quy định trong kho như sau:\n'
                           '\n'
                           '1. Quy trình nghiệp vụ: Nhập hàng vào kho, xuất hàng khỏi kho, kiểm kê hàng hóa, bàn giao '
                           'ca làm việc, đối soát đơn hàng cuối ngày, quản lý khu vực kho lạnh.\n'
                           '2. Hướng dẫn đóng gói & vận hành: Đóng gói hàng dễ vỡ, vận hành máy in mã vạch, quy định '
                           'lái xe nâng.\n'
                           '3. Quy tắc an toàn & sự cố: Quy tắc an toàn lao động, xử lý sự cố cháy nổ hỏa hoạn, xử lý '
                           'hàng rách hộp/hàng hỏng khi nhập.\n'
                           '4. Kiến thức chung: Nguyên tắc FIFO/FEFO.\n'
                           '\n'
                           'Cậu muốn tìm hiểu sâu về quy trình nào thì cứ nói tớ nhé.',
                           'Ngoài những thông tin vừa rồi, tớ còn nắm rõ các quy trình sau của kho mình nè:\n'
                           '\n'
                           '- Nhập xuất hàng hóa, kiểm kê và đối soát đơn hàng.\n'
                           '- Đóng gói hàng dễ vỡ và vận hành máy in mã vạch.\n'
                           '- Quy tắc an toàn lao động, vận hành xe nâng.\n'
                           '- Quản lý kho lạnh, bàn giao ca làm việc.\n'
                           '- Nguyên tắc FIFO/FEFO và xử lý cháy nổ.\n'
                           '\n'
                           'Cậu muốn tớ hướng dẫn chi tiết phần nào nào?']},
            {'id': 'receiving-goods',
             'category': 'procedure',
             'title': 'Quy trình nhập hàng vào kho',
             'keywords': ['nhap hang',
                          'quy trinh nhap',
                          'nhap kho',
                          'nhan hang',
                          'hang ve',
                          'xe giao hang',
                          'tai xe giao',
                          'kiem tra nhap',
                          'dong kiem nhap',
                          'nhap hang vao kho',
                          'hang moi ve',
                          'nhan hang tu ncc',
                          'kiem hang',
                          'dem hang'],
             'training_samples': ['quy trình nhập hàng vào kho như thế nào',
                                  'nhập hàng làm sao',
                                  'hàng mới về thì xử lý thế nào',
                                  'cách nhập hàng vào kho',
                                  'nhận hàng từ nhà cung cấp quy trình ra sao',
                                  'xe giao hàng tới thì tớ phải làm gì',
                                  'kiểm tra hàng nhập kho',
                                  'hang ve thi lam j',
                                  'nhap hang ntn m',
                                  'quy trinh nhan hang tu ncc',
                                  'bước nhập hàng vào kho',
                                  'dem hang nhap kho',
                                  'kiem hang nhu nao',
                                  'hàng mói về xử lí sao',
                                  'xe hang toi roi lam gi day'],
             'responses': ['Quy trình nhập hàng vào kho gồm các bước chuẩn sau cậu nhé:\n'
                           '\n'
                           'Bước 1 - Tiếp nhận xe hàng: Khi xe giao hàng đến bến, cậu kiểm tra phiếu giao hàng của tài '
                           'xế để xác nhận đúng đơn hàng, đúng nhà cung cấp.\n'
                           '\n'
                           'Bước 2 - Đồng kiểm số lượng: Cậu cùng tài xế đếm từng thùng hàng, đối chiếu số lượng thực '
                           'tế với phiếu giao. Ghi chép lại số lượng thiếu hoặc dư (nếu có).\n'
                           '\n'
                           'Bước 3 - Kiểm tra chất lượng bên ngoài: Quan sát tình trạng thùng hàng xem có bị rách, '
                           'méo, ướt hay biến dạng không. Nếu phát hiện hàng lỗi thì chuyển sang quy trình xử lý hàng '
                           'hỏng.\n'
                           '\n'
                           'Bước 4 - Ký biên bản nhận hàng: Cả hai bên ký xác nhận biên bản đồng kiểm. Tài xế giữ 1 '
                           'bản, kho giữ 1 bản.\n'
                           '\n'
                           'Bước 5 - Nhập hệ thống: Cậu quét mã vạch hoặc nhập tay mã sản phẩm vào phần mềm quản lý '
                           'kho để cập nhật tồn kho. Sau đó sắp xếp hàng lên kệ theo đúng vị trí quy định.\n'
                           '\n'
                           'Nhớ làm đầy đủ các bước để tránh sai lệch số liệu cuối ngày nhé cậu.',
                           'Khi hàng về tới kho thì cậu làm theo trình tự này nha:\n'
                           '\n'
                           'Đầu tiên, cậu ra bến nhận phiếu giao hàng từ tài xế và đối chiếu với đơn đặt hàng trên hệ '
                           'thống.\n'
                           'Tiếp theo, cùng tài xế kiểm đếm từng thùng hàng thật kỹ. Hàng nào bị hư hỏng bên ngoài thì '
                           'tách riêng ra.\n'
                           'Sau khi kiểm đếm xong, hai bên cùng ký biên bản xác nhận số lượng đã nhận.\n'
                           'Cuối cùng, cậu quét mã vạch nhập vào hệ thống và xếp hàng lên kệ đúng vị trí.\n'
                           '\n'
                           'Quy trình tuy đơn giản nhưng cậu nhớ làm cẩn thận bước kiểm đếm nhé, vì nếu ký nhận mà '
                           'thiếu hàng thì kho mình phải chịu.',
                           'Nhập hàng là một trong những quy trình quan trọng nhất ở kho mình đó cậu. Tớ hướng dẫn '
                           'ngắn gọn nè:\n'
                           '\n'
                           'Xe hàng đến, cậu check phiếu giao hàng trước. Rồi đếm hàng cùng tài xế, kiểm tra xem thùng '
                           'nào bị lỗi thì tách ra ghi biên bản riêng. Đếm xong thì ký biên bản nhận hàng, sau đó quét '
                           'mã lên hệ thống và xếp kệ.\n'
                           '\n'
                           'Mấu chốt là bước đồng kiểm phải thật chính xác. Nếu phát hiện thùng nào rách hay méo thì '
                           'chụp ảnh lại làm bằng chứng luôn nhé.']},
            {'id': 'shipping-goods',
             'category': 'procedure',
             'title': 'Quy trình xuất hàng khỏi kho',
             'keywords': ['xuat hang',
                          'quy trinh xuat',
                          'xuat kho',
                          'giao hang',
                          'dong hang',
                          'pick hang',
                          'nhat hang',
                          'packing',
                          'chuan bi don',
                          'gui hang',
                          'don hang xuat',
                          'lay hang'],
             'training_samples': ['quy trình xuất hàng như thế nào',
                                  'xuất kho làm sao',
                                  'cách lấy hàng giao cho khách',
                                  'đóng hàng xuất kho quy trình ra sao',
                                  'pick hàng là gì',
                                  'nhặt hàng theo đơn thế nào',
                                  'xuat hang ntn',
                                  'don hang xuat thi lam gi',
                                  'cách chuẩn bị đơn hàng giao',
                                  'lay hang xuat kho',
                                  'quy trinh dong goi xuat',
                                  'gui hang cho khach',
                                  'dong hang de giao',
                                  'xuat hang lam j',
                                  'buoc xuat hang'],
             'responses': ['Quy trình xuất hàng khỏi kho gồm các bước sau cậu nhé:\n'
                           '\n'
                           'Bước 1 - Nhận lệnh xuất: Cậu nhận danh sách đơn hàng cần xuất từ hệ thống quản lý kho. '
                           'Kiểm tra thông tin đơn hàng gồm mã sản phẩm, số lượng, địa chỉ giao.\n'
                           '\n'
                           'Bước 2 - Pick hàng (nhặt hàng): Cậu đi đến đúng vị trí kệ theo chỉ dẫn trên phiếu pick, '
                           'lấy đúng sản phẩm và đúng số lượng. Quét mã vạch xác nhận từng món hàng.\n'
                           '\n'
                           'Bước 3 - Đóng gói: Xếp hàng vào thùng carton phù hợp kích thước. Hàng dễ vỡ thì bọc xốp '
                           'bong bóng trước. Dán tem nhãn giao hàng lên thùng.\n'
                           '\n'
                           'Bước 4 - Kiểm tra chéo: Một nhân viên khác kiểm tra lại đơn hàng đã đóng xem đúng sản phẩm '
                           'và số lượng chưa trước khi niêm phong.\n'
                           '\n'
                           'Bước 5 - Bàn giao vận chuyển: Xếp hàng lên xe giao và ký biên bản bàn giao cho tài xế.\n'
                           '\n'
                           'Cậu nhớ quét mã xác nhận ở mỗi bước để hệ thống cập nhật trạng thái đơn hàng nhé.',
                           'Xuất hàng cơ bản là ngược lại với nhập hàng thôi cậu. Tớ tóm tắt nè:\n'
                           '\n'
                           'Nhận đơn từ hệ thống, đi pick hàng đúng vị trí kệ, đóng gói cẩn thận, cho đồng nghiệp kiểm '
                           'tra chéo lại rồi bàn giao cho bên vận chuyển.\n'
                           '\n'
                           'Điều quan trọng nhất là phải quét mã vạch xác nhận ở từng bước. Nếu quên quét, hệ thống sẽ '
                           'không ghi nhận và cuối ngày đối soát sẽ bị lệch số liệu đó.',
                           'Quy trình xuất kho đơn giản nhưng cần cẩn thận cậu ạ:\n'
                           '\n'
                           'Cậu nhận lệnh xuất trên hệ thống, đi lấy hàng theo phiếu pick đúng vị trí kệ, sau đó đóng '
                           'gói kỹ càng và dán nhãn vận chuyển. Nhờ đồng nghiệp check lại một lần rồi giao cho tài xế '
                           'ký nhận.\n'
                           '\n'
                           'Mẹo nhỏ là cậu nên sắp xếp thứ tự pick hàng theo lối đi trong kho để đỡ mất thời gian đi '
                           'lại qua lại nhé.']},
            {'id': 'damaged-goods',
             'category': 'procedure',
             'title': 'Xử lý hàng rách hộp / hàng hỏng khi nhập',
             'keywords': ['hang rach hop',
                          'hang loi',
                          'hang hong',
                          'hang bi hu',
                          'xu ly hang loi',
                          'rach hop khi nhap',
                          'bien ban dong kiem',
                          'chup anh hang loi',
                          'bao cao hang loi',
                          'hang bi meo',
                          'hang bi uot',
                          'boi thuong hang',
                          'hang hu hong',
                          'thuong hong',
                          'loi hang'],
             'training_samples': ['hàng bị rách hộp khi nhập thì xử lý thế nào',
                                  'hàng hỏng phải làm sao',
                                  'nhập kho phát hiện hàng lỗi',
                                  'hang rach hop lam gi m',
                                  'hàng bị méo hộp xử lý sao',
                                  'quy trình xử lý hàng hư hỏng',
                                  'hàng bị ướt khi giao tới',
                                  'bồi thường hàng lỗi như thế nào',
                                  'biên bản đồng kiểm hàng hỏng',
                                  'chup anh hang loi o dau',
                                  'lam sao bao cao hang hong',
                                  'hang bi hu thi xu li ntn',
                                  'hang loi rach hop',
                                  'phat hien hang bi hong khi nhan',
                                  'hang bi rach thi lam gi day'],
             'responses': ['Quy trình chuẩn xử lý hàng bị rách hộp hoặc hư hỏng khi nhập kho gồm 3 bước cậu nhé:\n'
                           '\n'
                           'Bước 1 - Chụp ảnh bằng chứng: Cậu lấy điện thoại chụp lại hiện trạng vết rách, méo hoặc hư '
                           'hỏng thật rõ nét. Chụp cả mã vạch trên thùng hàng để dễ đối chiếu.\n'
                           '\n'
                           'Bước 2 - Lập biên bản đồng kiểm: Cậu và tài xế giao hàng cùng ký vào biên bản ghi nhận số '
                           'lượng hàng hỏng, mô tả tình trạng hư hỏng cụ thể. Biên bản này là cơ sở để yêu cầu bồi '
                           'thường.\n'
                           '\n'
                           'Bước 3 - Báo cáo trên hệ thống: Cậu vào phần mềm quản lý kho, bấm nút Báo cáo hàng lỗi, '
                           'tải ảnh lên và điền thông tin. Hệ thống sẽ tự động thông báo cho ban quản lý xử lý tiếp.\n'
                           '\n'
                           'Lưu ý quan trọng là tuyệt đối không nhập hàng lỗi vào kho như hàng bình thường nhé cậu. '
                           'Phải tách riêng ra khu vực chờ xử lý.',
                           'Nếu phát hiện hàng bị rách hộp hoặc hư hỏng khi xe giao tới, cậu xử lý thế này nha:\n'
                           '\n'
                           'Đầu tiên giữ nguyên hiện trạng và chụp ảnh rõ ràng. Sau đó lập biên bản có chữ ký của tài '
                           'xế xác nhận tình trạng hàng lỗi. Cuối cùng lên hệ thống bấm nút Báo cáo hàng lỗi để ghi '
                           'nhận.\n'
                           '\n'
                           'Mấu chốt là phải có biên bản đồng kiểm có chữ ký tài xế. Vì nếu không có giấy tờ này thì '
                           'kho mình sẽ không yêu cầu bồi thường được từ nhà cung cấp hoặc đơn vị vận chuyển.',
                           'Gặp hàng rách hộp hay bị hỏng lúc nhập kho thì cậu bình tĩnh làm theo 3 bước này nhé:\n'
                           '\n'
                           'Chụp ảnh, lập biên bản cùng tài xế, rồi báo cáo lên hệ thống. Nhớ tách hàng lỗi ra riêng, '
                           'đừng xếp chung với hàng tốt.\n'
                           '\n'
                           'Tớ nhấn mạnh là bước chụp ảnh rất quan trọng vì nó là bằng chứng để ban quản lý liên hệ '
                           'nhà cung cấp yêu cầu đổi trả hoặc bồi thường. Cậu chụp rõ vết hỏng và cả mã vạch trên '
                           'thùng nhé.']},
            {'id': 'fragile-packaging',
             'category': 'procedure',
             'title': 'Quy trình đóng gói hàng dễ vỡ',
             'keywords': ['dong goi',
                          'hang de vo',
                          'dong goi hang de vo',
                          'boc xop',
                          'bubble wrap',
                          'xop bong bong',
                          'bang keo chu thap',
                          'nhan hang de vo',
                          'dong goi can than',
                          'hang thuy tinh',
                          'hang su',
                          'hang gom',
                          'boc hang',
                          'goi hang de vo',
                          'chong soc'],
             'training_samples': ['đóng gói hàng dễ vỡ như thế nào',
                                  'cách bọc hàng dễ vỡ',
                                  'quy trình đóng gói hàng thủy tinh',
                                  'hàng dễ vỡ đóng gói ntn',
                                  'boc xop hang de vo lam sao',
                                  'dong goi hang su gom',
                                  'cach goi hang de vo cho an toan',
                                  'hang thuy tinh dong goi kieu gi',
                                  'can lam gi de hang k bi vo',
                                  'cach boc xop chong soc',
                                  'dong goi can than nhu nao',
                                  'hang de be dong goi the nao',
                                  'boc bong bong khi the nao',
                                  'dong goi hang de vo ra sao',
                                  'lam sao bao ve hang de vo'],
             'responses': ['Quy trình đóng gói hàng dễ vỡ chuẩn của kho mình gồm 4 bước cậu nhé:\n'
                           '\n'
                           'Bước 1 - Bọc chống sốc: Dùng xốp bong bóng khí bọc kín sản phẩm ít nhất 3 lớp. Đặc biệt '
                           'chú ý bọc dày ở các góc cạnh vì đây là nơi dễ va đập nhất.\n'
                           '\n'
                           'Bước 2 - Xếp vào thùng carton: Đặt sản phẩm đã bọc vào thùng carton cứng. Chèn kín các '
                           'khoảng trống bằng hạt xốp hoặc giấy vụn để sản phẩm không xê dịch khi vận chuyển.\n'
                           '\n'
                           'Bước 3 - Niêm phong thùng: Dán băng keo hình chữ thập ở cả đáy và nắp thùng để gia cố chắc '
                           'chắn.\n'
                           '\n'
                           'Bước 4 - Dán nhãn cảnh báo: Bắt buộc dán nhãn Hàng dễ vỡ màu đỏ ở vị trí dễ thấy nhất bên '
                           'ngoài thùng để nhân viên vận chuyển biết mà nhẹ tay.\n'
                           '\n'
                           'Cậu lắc thử thùng sau khi đóng gói xong, nếu còn nghe tiếng lọc xọc bên trong thì cần chèn '
                           'thêm xốp nhé.',
                           'Đóng gói hàng dễ vỡ thì cậu nhớ công thức 3 lớp này nha:\n'
                           '\n'
                           'Lớp 1 là xốp bong bóng bọc kín sản phẩm tối thiểu 3 vòng.\n'
                           'Lớp 2 là giấy chèn hoặc hạt xốp lấp đầy khoảng trống trong thùng carton.\n'
                           'Lớp 3 là băng keo dán chữ thập niêm phong chắc chắn.\n'
                           '\n'
                           'Sau cùng nhớ dán nhãn Hàng dễ vỡ màu đỏ nổi bật bên ngoài thùng. Làm đúng trình tự này thì '
                           'hàng đi xa mấy cũng an toàn cậu ạ.',
                           'Bọc hàng dễ vỡ không khó nhưng cần tỉ mỉ cậu ơi. Tớ chỉ nhanh nè:\n'
                           '\n'
                           'Bọc xốp bong bóng 3 lớp cho sản phẩm, nhét chặt hạt xốp vào thùng carton để hàng không '
                           'lung lay, dán băng keo chữ thập gia cố và cuối cùng dán tem Hàng dễ vỡ.\n'
                           '\n'
                           'Mẹo kiểm tra là lắc thử thùng hàng. Nếu không nghe tiếng gì bên trong thì là đạt chuẩn '
                           'rồi. Cậu làm cẩn thận khâu này nhé, hàng đến tay khách nguyên vẹn là nhờ công đóng gói của '
                           'cậu đó.']},
            {'id': 'barcode-printer',
             'category': 'procedure',
             'title': 'Hướng dẫn vận hành máy in mã vạch',
             'keywords': ['may in ma vach',
                          'in ma vach',
                          'in tem',
                          'may in tem',
                          'giay decal',
                          'muc in ribbon',
                          'bartender',
                          'barcode',
                          'in test',
                          'in thu',
                          'may in bi loi',
                          'calibrate',
                          'quet ma vach',
                          'ma vach',
                          'in nhan',
                          'in label'],
             'training_samples': ['cách dùng máy in mã vạch',
                                  'hướng dẫn in tem mã vạch',
                                  'máy in mã vạch dùng sao',
                                  'in ma vach ntn',
                                  'cach in tem san pham',
                                  'may in tem bi loi lam sao',
                                  'thay giay decal the nao',
                                  'thay muc ribbon may in',
                                  'phan mem bartender dung sao',
                                  'in thu test tem',
                                  'may in bi mo chu lam gi',
                                  'calibrate may in la gi',
                                  'máy in mã vạch hoạt dộng sao',
                                  'in barcode nhu nào',
                                  'cach su dung may in ma vach'],
             'responses': ['Tớ chỉ cậu cách vận hành máy in mã vạch từ A đến Z nhé:\n'
                           '\n'
                           'Bước 1 - Kiểm tra vật liệu: Mở nắp máy kiểm tra cuộn giấy decal và cuộn mực ribbon còn đủ '
                           'không. Nếu hết thì thay cuộn mới, nhớ lắp đúng chiều theo hình hướng dẫn trên thân máy.\n'
                           '\n'
                           'Bước 2 - Kết nối: Kiểm tra dây nguồn và cáp USB nối máy in với máy tính đã cắm chặt chưa. '
                           'Bật công tắc nguồn phía sau máy.\n'
                           '\n'
                           'Bước 3 - Mở phần mềm: Mở phần mềm Bartender trên máy tính, chọn mẫu tem chuẩn của kho và '
                           'nhập mã sản phẩm cần in.\n'
                           '\n'
                           'Bước 4 - In thử: Bấm in test 1 tem trước để kiểm tra nét chữ có rõ không, có bị lệch '
                           'không. Nếu đẹp rồi thì bấm in hàng loạt.\n'
                           '\n'
                           'Nếu máy nhấp nháy đèn đỏ báo lỗi, cậu nhấn nút Calibrate hoặc giữ nút Feed vài giây để máy '
                           'tự cân lại giấy nhé.',
                           'Máy in mã vạch dùng đơn giản lắm cậu ơi. Chỉ cần nhớ 4 bước:\n'
                           '\n'
                           'Kiểm tra giấy và mực có đủ không, cắm dây kết nối máy tính, mở Bartender lên nhập mã sản '
                           'phẩm, rồi in thử 1 tem xem có nét không.\n'
                           '\n'
                           'Tem in ra chuẩn rồi thì cứ yên tâm bấm in số lượng lớn. Nếu chữ bị mờ thì thường là do hết '
                           'mực ribbon, cậu thay cuộn mới là được.',
                           'Cách dùng máy in mã vạch cho cậu nè:\n'
                           '\n'
                           'Đầu tiên check giấy decal và mực ribbon, lắp vào máy đúng chiều. Kết nối USB với máy tính '
                           'rồi bật nguồn. Mở phần mềm Bartender chọn mẫu tem, nhập mã hàng cần in. Luôn in test 1 tem '
                           'trước khi in hàng loạt.\n'
                           '\n'
                           'Nếu giấy bị lệch hoặc máy báo lỗi, giữ nút Feed trên máy in vài giây để nó tự đo lại '
                           'khoảng cách giữa các tem nhé cậu.']},
            {'id': 'safety-rules',
             'category': 'procedure',
             'title': 'Quy tắc an toàn lao động trong kho',
             'keywords': ['an toan lao dong',
                          'an toan',
                          'bao ho',
                          'giay mui sat',
                          'ao phan quang',
                          'mu bao hiem',
                          'xe nang',
                          'toc do xe nang',
                          'quy tac an toan',
                          'phong chay',
                          'chua chay',
                          'tai nan',
                          'bao ho lao dong',
                          'an toan kho',
                          'nguy hiem'],
             'training_samples': ['quy tắc an toàn lao động trong kho',
                                  'an toàn lao động cần chú ý gì',
                                  'cần mặc đồ bảo hộ gì khi làm việc',
                                  'giày mũi sắt có bắt buộc không',
                                  'quy dinh an toan kho',
                                  'lam viec trong kho can chu y gi',
                                  'atld trong kho la gi',
                                  'bao ho lao dong gom nhung gi',
                                  'xe nang di toc do bao nhieu',
                                  'an toan khi lam viec o kho',
                                  'quy tac ve an toan',
                                  'can mang gi khi vao kho',
                                  'lam sao de an toan trong kho',
                                  'quy tăc an tòan',
                                  'đồ bảo hộ lao dộng gồm gì'],
             'responses': ['An toàn lao động là ưu tiên số một khi làm việc trong kho cậu nhé. Tớ liệt kê các quy tắc '
                           'quan trọng:\n'
                           '\n'
                           '1. Trang bị bảo hộ bắt buộc:\n'
                           '   - Áo phản quang: để xe nâng dễ nhìn thấy cậu từ xa\n'
                           '   - Giày mũi sắt: bảo vệ chân phòng hàng rơi trúng\n'
                           '   - Mũ bảo hiểm: khi làm việc gần kệ hàng cao\n'
                           '\n'
                           '2. Quy tắc xếp hàng:\n'
                           '   - Hàng nặng xếp tầng dưới, hàng nhẹ xếp trên\n'
                           '   - Không xếp vượt quá chiều cao giới hạn của kệ\n'
                           '   - Không leo trèo kệ hàng, phải dùng thang chuyên dụng\n'
                           '\n'
                           '3. Quy tắc di chuyển:\n'
                           '   - Đi đúng phần đường dành cho người đi bộ\n'
                           '   - Không đứng dưới càng nâng của xe nâng\n'
                           '   - Xe nâng không được chạy quá 10 km/h trong kho\n'
                           '   - Quan sát gương cầu lồi ở các ngã rẽ\n'
                           '\n'
                           'Cậu nhớ tuân thủ nghiêm túc nhé, an toàn là trên hết.',
                           'Làm việc ở kho có mấy quy tắc an toàn xương máu cậu cần nằm lòng nè:\n'
                           '\n'
                           'Luôn mặc áo phản quang và đi giày mũi sắt trước khi vào khu vực làm việc. Khi di chuyển '
                           'trong kho phải đi đúng làn đường cho người đi bộ và quan sát gương cầu lồi ở góc cua. '
                           'Tuyệt đối không đứng hoặc đi dưới xe nâng đang bốc hàng trên cao.\n'
                           '\n'
                           'Về xếp hàng thì nhớ luôn để hàng nặng ở dưới, nhẹ ở trên. Đừng xếp quá cao vượt giới hạn '
                           'kệ kẻo đổ sập nguy hiểm lắm.\n'
                           '\n'
                           'Cậu giữ gìn an toàn cho bản thân và đồng nghiệp nhé, cuối ngày ai cũng khỏe mạnh về nhà là '
                           'vui nhất.',
                           'Quy tắc an toàn lao động trong kho tớ tổng hợp cho cậu nè:\n'
                           '\n'
                           'Đồ bảo hộ bắt buộc gồm áo phản quang, giày mũi sắt và mũ bảo hiểm. Trong kho phải đi đúng '
                           'làn đường người đi bộ, tránh xa khu vực xe nâng đang hoạt động. Xếp hàng lên kệ thì nặng '
                           'dưới nhẹ trên, không leo trèo kệ, không vượt giới hạn chiều cao.\n'
                           '\n'
                           'Xe nâng trong kho giới hạn tốc độ 10 km/h. Nếu thấy tình huống nguy hiểm thì báo ngay cho '
                           'quản lý ca trực nhé cậu.']},
            {'id': 'inventory-counting',
             'category': 'procedure',
             'title': 'Quy trình kiểm kê hàng hóa',
             'keywords': ['kiem ke',
                          'kiem hang',
                          'dem hang',
                          'ton kho',
                          'kiem ke dinh ky',
                          'kiem ke dot xuat',
                          'doi soat',
                          'chenh lech ton',
                          'sai so ton kho',
                          'kiem dem'],
             'training_samples': ['kiểm kê hàng hóa như thế nào',
                                  'quy trình kiểm kê định kỳ',
                                  'đếm hàng tồn kho làm sao',
                                  'kiem ke ton kho ntn',
                                  'cach kiem dem hang hoa',
                                  'khi nao thi kiem ke',
                                  'chenh lech ton kho xu ly sao',
                                  'doi soat hang ton',
                                  'kiem ke dot xuat la gi',
                                  'cach dem hang cho chinh xac',
                                  'kiem ke hang nhu nao',
                                  'sai so ton kho thi lam gi',
                                  'quy trình kiểm kê hàng',
                                  'dem hang ton kho',
                                  'lam sao kiem ke cho nhanh'],
             'responses': ['Kiểm kê hàng hóa trong kho mình có 2 loại cậu nhé:\n'
                           '\n'
                           'Loại 1 - Kiểm kê định kỳ (mỗi tháng hoặc quý):\n'
                           '- Nhận danh sách kiểm kê từ quản lý\n'
                           '- Đếm thực tế từng mã hàng trên kệ, ghi vào phiếu kiểm kê\n'
                           '- Đối soát số lượng thực tế với số liệu trên hệ thống\n'
                           '- Ghi nhận chênh lệch (nếu có) và báo cáo quản lý\n'
                           '\n'
                           'Loại 2 - Kiểm kê đột xuất:\n'
                           '- Được yêu cầu khi phát hiện có dấu hiệu bất thường như hàng mất, sai số\n'
                           '- Thực hiện ngay, không cần đợi đến kỳ kiểm kê\n'
                           '\n'
                           'Khi đếm hàng, cậu nhớ đếm 2 lần cho chắc chắn. Nếu phát hiện chênh lệch so với hệ thống '
                           'thì ghi rõ vào biên bản và báo quản lý ngay, đừng tự ý điều chỉnh số liệu trên hệ thống '
                           'nhé.',
                           'Quy trình kiểm kê tớ hướng dẫn ngắn gọn nè:\n'
                           '\n'
                           'Nhận phiếu kiểm kê, đi đếm hàng thực tế trên từng kệ, ghi số lượng vào phiếu, rồi so với '
                           'số trên hệ thống. Chỗ nào lệch thì ghi chú lại báo sếp.\n'
                           '\n'
                           'Mẹo là cậu nên đếm theo thứ tự kệ từ trái sang phải, trên xuống dưới để không bị sót. Và '
                           'luôn đếm 2 lần cho chính xác nhé.',
                           'Kiểm kê hàng tồn kho là việc đếm hàng thực tế rồi so với số liệu trên hệ thống cậu ạ.\n'
                           '\n'
                           'Kho mình thường kiểm kê định kỳ hàng tháng và có thể kiểm kê đột xuất nếu phát hiện bất '
                           'thường. Cậu cần đếm chính xác số lượng từng mã hàng, ghi vào phiếu kiểm kê và đối soát với '
                           'hệ thống.\n'
                           '\n'
                           'Nếu thấy chênh lệch thì cậu báo ngay cho quản lý, tuyệt đối không được tự sửa số liệu trên '
                           'hệ thống nhé. Vì việc tự ý sửa sẽ bị gắn cờ bất thường bởi hệ thống AI giám sát.']},
            {'id': 'returns-handling',
             'category': 'procedure',
             'title': 'Xử lý hàng trả về / đổi trả',
             'keywords': ['hang tra ve',
                          'doi tra',
                          'hoan hang',
                          'khach tra hang',
                          'tra lai hang',
                          'xu ly hang tra',
                          'hang bi tra lai',
                          'hoan tien',
                          'kiem tra hang tra',
                          'nhap lai hang tra'],
             'training_samples': ['quy trình xử lý hàng trả về',
                                  'khách trả hàng thì làm sao',
                                  'hàng bị trả lại xử lý thế nào',
                                  'hang tra ve nhap lai kho ra sao',
                                  'doi tra hang ntn',
                                  'quy trinh hoan hang',
                                  'khach hoan hang lam gi',
                                  'hang bi tra lai xu ly sao m',
                                  'cach xu ly don hoan hang',
                                  'hang tra ve kiem tra gi',
                                  'nhap lai hang hoan',
                                  'don hoan hang can lam gi',
                                  'quy trinh nhan hang doi tra',
                                  'hang khach tra lai',
                                  'xu ly hoan hang nhu nao'],
             'responses': ['Quy trình xử lý hàng trả về gồm các bước cậu nhé:\n'
                           '\n'
                           'Bước 1 - Tiếp nhận hàng trả: Nhận kiện hàng từ bên vận chuyển, kiểm tra phiếu hoàn hàng '
                           'xem đúng mã đơn hàng và lý do trả không.\n'
                           '\n'
                           'Bước 2 - Kiểm tra tình trạng: Mở kiện hàng kiểm tra xem sản phẩm còn nguyên vẹn, đầy đủ '
                           'phụ kiện hay không. Phân loại thành: hàng còn bán được, hàng hỏng cần xử lý.\n'
                           '\n'
                           'Bước 3 - Cập nhật hệ thống: Quét mã vạch nhập lại hàng trả về vào hệ thống. Hàng còn tốt '
                           'thì nhập kho bình thường. Hàng hỏng thì chuyển sang khu vực xử lý riêng.\n'
                           '\n'
                           'Bước 4 - Lưu hồ sơ: Ghi chép đầy đủ thông tin đơn hoàn vào sổ theo dõi để đối soát cuối '
                           'kỳ.\n'
                           '\n'
                           'Cậu nhớ kiểm tra kỹ hàng trả về trước khi nhập lại kho nhé. Tránh trường hợp hàng đã hỏng '
                           'mà nhập lại rồi gửi cho khách khác.',
                           'Hàng trả về thì cậu xử lý theo trình tự này nha:\n'
                           '\n'
                           'Nhận kiện hàng và phiếu hoàn, kiểm tra hàng có còn nguyên vẹn không, phân loại hàng tốt và '
                           'hàng hỏng, rồi quét mã nhập lại hệ thống.\n'
                           '\n'
                           'Hàng nào còn bán được thì xếp lại lên kệ. Hàng nào hỏng thì để riêng khu chờ xử lý. Nhớ '
                           'ghi sổ theo dõi đầy đủ nhé cậu.',
                           'Khi nhận hàng hoàn trả từ khách, cậu cần check 3 thứ: phiếu hoàn hàng có khớp không, sản '
                           'phẩm còn nguyên vẹn không, và phụ kiện đi kèm có đủ không.\n'
                           '\n'
                           'Sau đó phân loại: hàng tốt nhập lại kho, hàng lỗi để khu xử lý riêng. Cập nhật lên hệ '
                           'thống và ghi sổ theo dõi. Đơn giản vậy thôi cậu.']},
            {'id': 'fifo-fefo',
             'category': 'procedure',
             'title': 'Nguyên tắc FIFO / FEFO trong quản lý kho',
             'keywords': ['fifo',
                          'fefo',
                          'nhap truoc xuat truoc',
                          'han su dung',
                          'xoay vong hang',
                          'hang cu xuat truoc',
                          'first in first out',
                          'first expired first out',
                          'sap xep hang theo han',
                          'hang het han',
                          'hang sap het han'],
             'training_samples': ['FIFO là gì',
                                  'FEFO là gì',
                                  'quy tắc nhập trước xuất trước',
                                  'fifo fefo khac nhau sao',
                                  'tai sao phai ap dung fifo',
                                  'han su dung quan ly the nao',
                                  'hang cu xuat truoc dung k',
                                  'cach sap xep hang theo han su dung',
                                  'lam sao de hang k bi het han',
                                  'nguyen tac xoay vong hang',
                                  'fifo ap dung nhu nao',
                                  'fefo la cai gi vay',
                                  'sap xep hang ton kho theo fifo',
                                  'nhập trước xuất trước nghia la gì',
                                  'quản lí hạn sử dụng'],
             'responses': ['FIFO và FEFO là hai nguyên tắc quản lý kho cực kỳ quan trọng cậu cần nắm vững:\n'
                           '\n'
                           'FIFO (First In, First Out - Nhập trước, Xuất trước):\n'
                           '- Hàng nào nhập kho trước thì phải được xuất ra trước\n'
                           '- Áp dụng cho hầu hết các loại hàng hóa thông thường\n'
                           '- Khi xếp hàng mới, đẩy hàng cũ ra phía trước kệ, hàng mới xếp phía sau\n'
                           '\n'
                           'FEFO (First Expired, First Out - Hết hạn trước, Xuất trước):\n'
                           '- Hàng nào có hạn sử dụng ngắn nhất phải được xuất ra trước\n'
                           '- Áp dụng cho thực phẩm, mỹ phẩm, dược phẩm và hàng có date\n'
                           '- Phải kiểm tra hạn sử dụng mỗi khi xếp hàng lên kệ\n'
                           '\n'
                           'Ví dụ thực tế: Nếu lô hàng A nhập ngày 1/6 hạn sử dụng 30/8, lô B nhập ngày 5/6 nhưng hạn '
                           'sử dụng 15/7, thì theo FEFO phải xuất lô B trước vì nó hết hạn sớm hơn.\n'
                           '\n'
                           'Cậu nhớ luôn kiểm tra date khi xếp hàng lên kệ nhé.',
                           'FIFO và FEFO tớ giải thích đơn giản cho cậu hiểu nè:\n'
                           '\n'
                           'FIFO là nhập trước xuất trước, giống như xếp hàng mua đồ vậy, ai đến trước thì mua trước. '
                           'Hàng nào vào kho trước thì phải được lấy ra giao trước.\n'
                           '\n'
                           'FEFO thì ưu tiên theo hạn sử dụng, hàng nào sắp hết date thì xuất trước dù nó nhập sau. Áp '
                           'dụng cho đồ ăn, mỹ phẩm và các hàng có hạn sử dụng.\n'
                           '\n'
                           'Khi xếp kệ, cậu nhớ đẩy hàng cũ ra ngoài, hàng mới xếp phía trong nhé.',
                           'Hai nguyên tắc vàng trong quản lý kho là FIFO và FEFO cậu ạ:\n'
                           '\n'
                           'FIFO nghĩa là hàng nào nhập trước thì xuất trước để tránh hàng nằm quá lâu trong kho. FEFO '
                           'nghĩa là hàng nào gần hết hạn thì xuất trước để tránh phải hủy hàng quá date.\n'
                           '\n'
                           'Cách dễ nhất để thực hiện là khi xếp hàng mới lên kệ, cậu luôn đẩy lô cũ ra ngoài và đặt '
                           'lô mới phía trong. Với hàng có date thì ghi rõ ngày hết hạn lên thùng để dễ theo dõi.']},
            {'id': 'fire-emergency',
             'category': 'procedure',
             'title': 'Xử lý sự cố cháy nổ / hỏa hoạn trong kho',
             'keywords': ['chay no',
                          'hoa hoan',
                          'chay kho',
                          'binh chua chay',
                          'pccc',
                          'phong chay chua chay',
                          'thoat hiem',
                          'bao chay',
                          'khoi',
                          'lua',
                          'so tan',
                          'cuu hoa'],
             'training_samples': ['xử lý sự cố cháy nổ trong kho',
                                  'kho bị cháy thì làm sao',
                                  'quy trình phòng cháy chữa cháy',
                                  'binh chua chay o dau',
                                  'pccc trong kho nhu nao',
                                  'bao chay thi lam gi',
                                  'cach thoat hiem khi chay',
                                  'sua dung binh chua chay',
                                  'khi co khoi thi xu ly sao',
                                  'phong chay trong kho',
                                  'cach so tan khi chay',
                                  'hoa hoan phai lam gi',
                                  'loi thoat hiem o dau',
                                  'quy dinh pccc',
                                  'kho bi chay no'],
             'responses': ['Đây là quy trình xử lý khẩn cấp khi xảy ra cháy nổ trong kho, cậu cần thuộc lòng nhé:\n'
                           '\n'
                           'Bước 1 - Báo động: Ngay khi phát hiện khói hoặc lửa, bấm nút báo cháy gần nhất và hét to '
                           'thông báo cho mọi người xung quanh.\n'
                           '\n'
                           'Bước 2 - Gọi cứu hỏa: Gọi ngay số 114 báo cháy. Thông báo rõ địa chỉ kho và tình trạng.\n'
                           '\n'
                           'Bước 3 - Sơ tán: Nếu đám cháy lớn, ưu tiên sơ tán người ra khỏi kho theo lối thoát hiểm '
                           'được đánh dấu. Không quay lại lấy đồ cá nhân.\n'
                           '\n'
                           'Bước 4 - Chữa cháy ban đầu: Nếu đám cháy nhỏ và cậu đã được huấn luyện, dùng bình chữa '
                           'cháy gần nhất (bình CO2 hoặc bình bột). Cách dùng: rút chốt, hướng vòi vào gốc lửa, bóp '
                           'tay cầm và quét từ trái sang phải.\n'
                           '\n'
                           'Vị trí bình chữa cháy: treo trên tường tại mỗi góc kho và gần cửa ra vào. Lối thoát hiểm: '
                           'cửa có biển xanh Exit ở cuối mỗi dãy kệ.\n'
                           '\n'
                           'An toàn tính mạng con người luôn là ưu tiên số 1, hàng hóa có thể thay thế được cậu nhé.',
                           'Khi phát hiện cháy trong kho, cậu nhớ nguyên tắc: Báo động, Sơ tán, Chữa cháy.\n'
                           '\n'
                           'Đầu tiên bấm nút báo cháy và hét to cho mọi người biết. Gọi 114 ngay lập tức. Ưu tiên đưa '
                           'người ra khỏi kho theo lối thoát hiểm trước.\n'
                           '\n'
                           'Nếu lửa còn nhỏ và cậu biết cách dùng bình chữa cháy thì có thể dập ngay. Nhưng nếu lửa '
                           'lớn thì tuyệt đối không cố chữa, hãy di tản ra ngoài an toàn.\n'
                           '\n'
                           'Bình chữa cháy treo ở mỗi góc kho. Lối thoát hiểm là cửa có biển xanh Exit. Mạng người là '
                           'trên hết cậu nhé.',
                           'Sự cố cháy nổ là tình huống khẩn cấp nhất ở kho. Cậu nắm chắc quy trình này nha:\n'
                           '\n'
                           'Phát hiện cháy thì bấm chuông báo cháy ngay, hét thông báo cho đồng nghiệp. Gọi 114 báo '
                           'địa chỉ kho. Sơ tán mọi người theo lối thoát hiểm, đừng quay lại lấy đồ.\n'
                           '\n'
                           'Nếu lửa nhỏ, dùng bình chữa cháy: rút chốt, chĩa vào gốc lửa, bóp tay cầm, quét trái phải. '
                           'Lửa lớn thì chạy ra ngoài ngay, đợi lính cứu hỏa chuyên nghiệp xử lý.\n'
                           '\n'
                           'Nhớ là tính mạng con người luôn là ưu tiên cao nhất cậu ạ.']},
            {'id': 'shift-handover',
             'category': 'procedure',
             'title': 'Quy trình bàn giao ca làm việc',
             'keywords': ['ban giao ca',
                          'doi ca',
                          'giao ca',
                          'nhan ca',
                          'ca lam viec',
                          'so ban giao',
                          'nhat ky ca',
                          'thong tin ban giao',
                          'ca sang',
                          'ca chieu',
                          'ca dem'],
             'training_samples': ['quy trình bàn giao ca làm việc',
                                  'bàn giao ca như thế nào',
                                  'đổi ca cần làm gì',
                                  'ban giao ca ntn',
                                  'giao ca cho nguoi khac lam gi',
                                  'nhan ca moi can check gi',
                                  'so ban giao ca ghi nhung gi',
                                  'ban giao ca sang chieu',
                                  'lam sao ban giao ca cho tot',
                                  'doi ca can luu y gi',
                                  'thong tin can ban giao khi het ca',
                                  'cach giao ca',
                                  'ban giao ca lam viec ra sao',
                                  'khi het ca thi lam gi',
                                  'truoc khi giao ca'],
             'responses': ['Bàn giao ca là khâu rất quan trọng để đảm bảo công việc kho được liên tục cậu nhé:\n'
                           '\n'
                           'Khi kết thúc ca, cậu cần bàn giao cho người ca sau các thông tin sau:\n'
                           '\n'
                           '1. Tình trạng đơn hàng: Đơn nào đã xử lý xong, đơn nào đang dở dang, đơn nào chưa pick.\n'
                           '\n'
                           '2. Sự cố phát sinh: Hàng lỗi phát hiện trong ca, thiết bị hỏng, xe nâng cần sửa chữa...\n'
                           '\n'
                           '3. Hàng chờ xử lý: Kiện hàng trả về chưa kiểm tra, hàng nhập chưa xếp kệ...\n'
                           '\n'
                           '4. Ghi sổ bàn giao: Ghi đầy đủ các mục trên vào sổ bàn giao ca. Cả người giao và người '
                           'nhận cùng ký tên xác nhận.\n'
                           '\n'
                           'Cậu đừng bỏ qua bước này nhé, vì nếu không bàn giao kỹ thì ca sau sẽ không biết việc gì '
                           'đang dở dang và có thể gây ra sai sót.',
                           'Bàn giao ca đơn giản thôi cậu. Trước khi ra về, cậu ghi vào sổ bàn giao: đơn hàng đã xong, '
                           'đơn đang dở, sự cố trong ca, và hàng chưa xử lý.\n'
                           '\n'
                           'Sau đó gặp người ca sau trao đổi miệng và cùng ký sổ. Như vậy ca sau sẽ nắm được toàn bộ '
                           'tình hình để tiếp tục công việc suôn sẻ.',
                           'Khi hết ca, cậu làm 3 việc chính nha:\n'
                           '\n'
                           'Ghi sổ bàn giao ca đầy đủ thông tin đơn hàng, sự cố và hàng tồn chưa xử lý. Trao đổi trực '
                           'tiếp với người nhận ca để nhấn mạnh những vấn đề quan trọng. Hai người cùng ký tên xác '
                           'nhận vào sổ.\n'
                           '\n'
                           'Bàn giao kỹ thì ca sau làm việc dễ hơn nhiều, cũng tránh được hiểu lầm hay bỏ sót công '
                           'việc.']},
            {'id': 'forklift-operation',
             'category': 'procedure',
             'title': 'Quy trình sử dụng xe nâng',
             'keywords': ['xe nang',
                          'lai xe nang',
                          'van hanh xe nang',
                          'chung chi xe nang',
                          'forklift',
                          'nang hang',
                          'ha hang',
                          'xe nang dien',
                          'toc do xe nang',
                          'an toan xe nang'],
             'training_samples': ['cách sử dụng xe nâng',
                                  'quy trình vận hành xe nâng',
                                  'lái xe nâng cần chú ý gì',
                                  'xe nang dung ntn',
                                  'co can chung chi xe nang khong',
                                  'toc do xe nang bao nhieu',
                                  'an toan khi lai xe nang',
                                  'cach nang hang len ke',
                                  'cach ha hang xuong',
                                  'forklift su dung sao',
                                  'quy dinh lai xe nang',
                                  'xe nang trong kho',
                                  'van hanh xe nang nhu nao',
                                  'ai duoc lai xe nang',
                                  'xe nâng diện dùng sao',
                                  'tại sao xe nâng chỉ chạy tối đa 10km/h',
                                  'nếu chạy quá 10km/h thì sao',
                                  'vì sao giới hạn tốc độ xe nâng',
                                  'sao xe nâng chỉ được chạy 10 km/h',
                                  'chạy xe nâng nhanh bị làm sao',
                                  'tại sao không nên lái xe nâng nhanh',
                                  'nếu lái xe nâng quá 10km/h thì có nguy hiểm gì',
                                  'quá 10km/h xe nâng sẽ bị gì',
                                  'sao không được chạy xe nâng quá 10km/h'],
             'responses': ['Xe nâng là thiết bị quan trọng nhưng cũng nguy hiểm nhất trong kho cậu nhé:\n'
                           '\n'
                           'Điều kiện lái xe nâng:\n'
                           '- Bắt buộc phải có chứng chỉ vận hành xe nâng do cơ quan có thẩm quyền cấp\n'
                           '- Được quản lý kho phân công và ghi tên vào danh sách người lái\n'
                           '- Không được lái khi mệt mỏi, say rượu hoặc uống thuốc gây buồn ngủ\n'
                           '\n'
                           'Quy tắc vận hành:\n'
                           '- Tốc độ tối đa 10 km/h trong kho, 5 km/h ở khu vực đông người\n'
                           '- Luôn bóp còi khi qua góc cua hoặc giao lộ trong kho\n'
                           '- Khi nâng hàng, nghiêng càng nâng về phía sau để hàng không trượt\n'
                           '- Khi di chuyển có hàng, giữ càng nâng thấp cách mặt đất khoảng 15-20cm\n'
                           '- Không nâng hàng vượt quá tải trọng cho phép của xe\n'
                           '- Tuyệt đối không chở người trên xe nâng\n'
                           '\n'
                           'Trước khi sử dụng, cậu phải kiểm tra phanh, đèn, còi và mức dầu thủy lực. Nếu phát hiện '
                           'hỏng hóc thì báo ngay cho bộ phận kỹ thuật nhé.',
                           'Xe nâng chỉ được lái bởi người có chứng chỉ vận hành cậu nhé. Nếu chưa có thì tuyệt đối '
                           'không được tự ý lái.\n'
                           '\n'
                           'Khi lái xe nâng nhớ: chạy tối đa 10 km/h, bóp còi khi qua góc cua, nâng hàng thì nghiêng '
                           'càng ra sau, di chuyển thì hạ càng thấp. Không chở người trên xe và không vượt tải trọng.\n'
                           '\n'
                           'Đầu ca làm việc phải check phanh, đèn, còi trước khi lái ra nhé cậu.',
                           'Quy định vận hành xe nâng cậu cần biết nè:\n'
                           '\n'
                           'Phải có chứng chỉ mới được lái, không ngoại lệ. Tốc độ không quá 10 km/h trong kho. Bóp '
                           'còi ở mọi góc cua. Nâng hàng thì nghiêng càng về phía mình. Di chuyển thì hạ càng thấp gần '
                           'mặt đất. Không chở người, không vượt tải.\n'
                           '\n'
                           'Trước mỗi ca phải kiểm tra xe: phanh, đèn, còi, dầu thủy lực. Xe có vấn đề thì báo kỹ '
                           'thuật, đừng cố lái cậu nhé.',
                           'Tớ giải thích lý do tại sao xe nâng trong kho chỉ được chạy tối đa 10 km/h và nếu chạy quá '
                           'tốc độ này sẽ cực kỳ nguy hiểm nhé:\n'
                           '1. Tại sao giới hạn 10 km/h:\n'
                           '   - Kho hàng là không gian kín, có nhiều lối rẽ khuất tầm nhìn (điểm mù) giữa các dãy kệ '
                           'hàng.\n'
                           '   - Có nhiều nhân viên đi bộ làm việc xung quanh. Xe nâng có khối lượng bản thân rất lớn '
                           '(từ 3 đến 5 tấn), cộng thêm tải trọng hàng hóa nên quán tính di chuyển là cực kỳ khổng '
                           'lồ.\n'
                           '2. Nếu chạy quá 10 km/h sẽ dẫn đến hậu quả nghiêm trọng gì:\n'
                           '   - Quãng đường phanh bị kéo dài: Khi phát hiện người đi bộ hoặc chướng ngại vật xuất '
                           'hiện đột ngột ở góc cua, tài xế sẽ không thể phanh kịp thời.\n'
                           '   - Rủi ro rơi đổ hàng hóa: Phanh gấp ở tốc độ cao sẽ làm hàng hóa (đặc biệt khi đang '
                           'nâng ở trên cao) trượt tự do về phía trước, rơi đổ hoặc đập thẳng vào cabin lái.\n'
                           '   - Rủi ro lật xe và sập kệ: Khi ôm cua ở tốc độ >10 km/h, lực ly tâm lớn kết hợp với '
                           'trọng tâm xe nâng cao sẽ làm lật nghiêng xe nâng, hoặc va quệt mạnh làm sập hệ thống kệ '
                           'hàng khung sắt xung quanh gây tai nạn liên hoàn.\n'
                           'Vì vậy, quy định tốc độ tối đa 10 km/h trong kho (và 5 km/h ở ngã rẽ) là quy tắc bắt buộc '
                           'để bảo vệ tính mạng của cậu và đồng nghiệp đó nha.']},
            {'id': 'cold-storage',
             'category': 'procedure',
             'title': 'Quản lý khu vực kho lạnh',
             'keywords': ['kho lanh',
                          'dong lanh',
                          'nhiet do',
                          'bao quan lanh',
                          'thuc pham lanh',
                          'tu lanh',
                          'tu dong',
                          'nhiet do kho',
                          'hang lanh',
                          'chuoi lanh',
                          'cold storage',
                          'kiem tra nhiet do'],
             'training_samples': ['quy trình quản lý kho lạnh',
                                  'kho lạnh vận hành như thế nào',
                                  'nhiệt độ kho lạnh bao nhiêu',
                                  'bao quan hang lanh ntn',
                                  'cach kiem tra nhiet do kho',
                                  'vao kho lanh can chu y gi',
                                  'hang dong lanh bao quan sao',
                                  'nhiet do kho lanh phai la bao nhieu',
                                  'quy dinh kho lanh',
                                  'thuc pham lanh giu nhu nao',
                                  'cold storage la gi',
                                  'kho lanh can nhiet do nao',
                                  'bảo quản hàng lạnh',
                                  'quản lí kho lạnh',
                                  'cách vào kho lanh an toan'],
             'responses': ['Khu vực kho lạnh có quy định riêng cậu cần tuân thủ nghiêm ngặt nhé:\n'
                           '\n'
                           'Nhiệt độ tiêu chuẩn:\n'
                           '- Kho mát (cho rau củ, trái cây): 2 đến 8 độ C\n'
                           '- Kho lạnh (cho thịt, hải sản tươi): -2 đến 2 độ C\n'
                           '- Kho đông lạnh (cho hàng đông): -18 đến -25 độ C\n'
                           '\n'
                           'Quy tắc làm việc trong kho lạnh:\n'
                           '- Mặc áo ấm, găng tay chống lạnh trước khi vào\n'
                           '- Không ở trong kho lạnh quá 30 phút liên tục, phải ra ngoài nghỉ ấm\n'
                           '- Kiểm tra nhiệt kế kho mỗi 2 giờ và ghi vào sổ theo dõi\n'
                           '- Đóng cửa kho nhanh chóng sau khi ra vào để giữ nhiệt độ ổn định\n'
                           '- Hàng xếp phải cách tường ít nhất 10cm để khí lạnh lưu thông đều\n'
                           '\n'
                           'Nếu phát hiện nhiệt độ kho tăng bất thường, báo ngay cho quản lý và bộ phận kỹ thuật để '
                           'kiểm tra hệ thống làm lạnh cậu nhé.',
                           'Làm việc ở kho lạnh thì cậu nhớ mặc đồ ấm đầy đủ trước khi vào nhé.\n'
                           '\n'
                           'Nhiệt độ kho tùy loại hàng: kho mát 2-8 độ, kho lạnh -2 đến 2 độ, kho đông -18 đến -25 độ. '
                           'Cậu phải kiểm tra nhiệt kế mỗi 2 tiếng và ghi sổ. Không ở trong kho lạnh quá 30 phút liên '
                           'tục.\n'
                           '\n'
                           'Khi xếp hàng trong kho lạnh, để cách tường ít nhất 10cm để khí lạnh tuần hoàn đều. Và nhớ '
                           'đóng cửa kho nhanh khi ra vào nhé.',
                           'Kho lạnh có quy định riêng cậu ạ. Nhiệt độ phải giữ đúng chuẩn: kho mát 2-8 độ C, kho lạnh '
                           '-2 đến 2 độ C, kho đông -18 đến -25 độ C.\n'
                           '\n'
                           'Trước khi vào phải mặc áo ấm và găng tay. Không ở trong quá 30 phút mỗi lần. Kiểm tra '
                           'nhiệt độ kho mỗi 2 giờ ghi sổ. Xếp hàng cách tường 10cm.\n'
                           '\n'
                           'Nếu thấy nhiệt độ kho bị lệch thì báo ngay quản lý và kỹ thuật nhé cậu, vì hàng lạnh mà '
                           'mất nhiệt độ là hỏng hết.']},
            {'id': 'order-reconciliation',
             'category': 'procedure',
             'title': 'Quy trình đối soát đơn hàng',
             'keywords': ['doi soat',
                          'doi soat don hang',
                          'kiem tra don hang',
                          'doi chieu don',
                          'sai don hang',
                          'thieu hang',
                          'du hang',
                          'chenh lech don',
                          'doi soat cuoi ngay',
                          'kiem tra phieu'],
             'training_samples': ['quy trình đối soát đơn hàng',
                                  'đối soát đơn hàng cuối ngày',
                                  'đối chiếu đơn hàng thế nào',
                                  'doi soat don ntn',
                                  'kiem tra don hang sai',
                                  'thieu hang trong don xu ly sao',
                                  'doi soat cuoi ngay lam gi',
                                  'chenh lech don hang',
                                  'cach doi chieu don hang',
                                  'doi soat phieu giao hang',
                                  'phat hien sai don',
                                  'don hang bi sai so luong',
                                  'cach doi soat',
                                  'lam sao kiem tra don hang chinh xac',
                                  'đối sóat đơn hàng'],
             'responses': ['Đối soát đơn hàng là việc kiểm tra lại tất cả các đơn đã xử lý trong ngày cậu nhé:\n'
                           '\n'
                           'Bước 1 - Tổng hợp dữ liệu: Cuối ca, cậu in danh sách tất cả đơn hàng đã xuất trong ngày từ '
                           'hệ thống quản lý kho.\n'
                           '\n'
                           'Bước 2 - Đối chiếu phiếu: So sánh danh sách trên hệ thống với phiếu xuất kho giấy (nếu '
                           'có). Kiểm tra xem mã hàng, số lượng có khớp nhau không.\n'
                           '\n'
                           'Bước 3 - Kiểm tra chênh lệch: Nếu phát hiện sai lệch (thừa hoặc thiếu hàng), ghi chú cụ '
                           'thể mã đơn, mã hàng và số lượng chênh lệch.\n'
                           '\n'
                           'Bước 4 - Báo cáo: Gửi báo cáo đối soát cho quản lý kho. Nếu có chênh lệch nghiêm trọng thì '
                           'phải kiểm tra camera và rà soát lại quy trình ngay.\n'
                           '\n'
                           'Cậu nhớ đối soát cuối mỗi ca nhé, đừng để dồn lại vì càng để lâu càng khó tìm ra nguyên '
                           'nhân sai lệch.',
                           'Đối soát đơn hàng cuối ngày cậu làm thế này nha:\n'
                           '\n'
                           'In danh sách đơn đã xuất từ hệ thống, so với phiếu giấy xem có khớp không. Chỗ nào lệch '
                           'thì ghi ra và báo quản lý.\n'
                           '\n'
                           'Quan trọng là làm đối soát ngay cuối ca, đừng để sang hôm sau vì lúc đó sẽ rất khó nhớ lại '
                           'chi tiết từng đơn.',
                           'Đối soát đơn hàng là bước cuối cùng trong ngày làm việc cậu ạ.\n'
                           '\n'
                           'Cậu lấy danh sách đơn trên hệ thống, đối chiếu với phiếu xuất kho thực tế. Mã hàng nào, số '
                           'lượng nào không khớp thì ghi lại và nộp báo cáo cho quản lý.\n'
                           '\n'
                           'Nếu chênh lệch lớn thì phải rà soát camera an ninh và kiểm tra lại từng bước trong quy '
                           'trình xuất hàng để tìm nguyên nhân. Cậu đối soát cẩn thận nhé.']},
            {'id': 'pda-device',
             'category': 'procedure',
             'title': 'Thiết bị quét mã vạch chuyên dụng PDA',
             'keywords': ['pda',
                          'may pda',
                          'may quet pda',
                          'thiet bi pda',
                          'pda la gi',
                          'pda la may gi',
                          'may quet ma vach pda'],
             'training_samples': ['máy PDA là máy gì',
                                  'máy quét pda là gì',
                                  'thiết bị pda dùng để làm gì',
                                  'pda là gì',
                                  'pda la gi',
                                  'may pda la gi',
                                  'tại sao phải dùng máy pda',
                                  'sao không dùng điện thoại mà dùng pda',
                                  'pda trong kho để làm gì',
                                  'hướng dẫn sử dụng máy pda'],
             'responses': ['Máy PDA (Personal Digital Assistant - Thiết bị hỗ trợ cá nhân kỹ thuật số) trong kho hàng '
                           'của mình là một thiết bị cầm tay chuyên dụng tích hợp đầu quét mã vạch laser và kết nối '
                           'Wi-Fi.\n'
                           '\n'
                           'Vai trò của máy PDA trong kho:\n'
                           '1. Quét mã vạch sản phẩm (SKU) và vị trí kệ để ghi nhận chính xác dữ liệu nhập kho, xuất '
                           'kho.\n'
                           '2. Nhận lệnh trực tiếp từ hệ thống quản lý kho (WMS), chỉ dẫn cậu đi nhặt hàng đúng vị trí '
                           'kệ.\n'
                           '3. Kiểm kê hàng tồn kho nhanh chóng và cập nhật trực tiếp lên hệ thống theo thời gian '
                           'thực.\n'
                           '\n'
                           'PDA giống như một chiếc điện thoại thông minh siêu bền, chịu va đập tốt và có mắt quét '
                           'quét mã vạch cực nhanh, giúp tụi mình làm việc chính xác 100%, không bị nhầm lẫn hàng hóa '
                           'cậu nhé.',
                           'PDA là máy quét mã vạch cầm tay chuyên dụng trong kho đó cậu.\n'
                           '\n'
                           'Nó giống như một chiếc điện thoại Android nhưng có gắn thêm mắt quét laser để quét mã hàng '
                           'SKU và mã vị trí kệ. Nó kết nối trực tiếp với hệ thống WMS để nhận lệnh nhập, xuất, kiểm '
                           'kê hàng hóa. Dùng máy này giúp tụi mình quét mã nhanh hơn, hạn chế tối đa việc nhập liệu '
                           'bằng tay dễ bị sai sót.',
                           'Máy PDA trong kho là thiết bị quét mã vạch cầm tay, kết nối trực tiếp hệ thống quản lý WMS '
                           'cậu ạ.\n'
                           '\n'
                           'Nhiệm vụ chính của nó là giúp cậu quét mã SKU khi nhập/xuất/kiểm hàng để hệ thống tự động '
                           'ghi nhận dữ liệu tồn kho. Nó có độ bền cao, chống nước chống va đập và quét mã vạch siêu '
                           'nhanh so với điện thoại thông thường.']}]}

DEEP_EXPLANATIONS = {'receiving-goods': 'Tớ hiểu rồi, để tớ giải thích thật cặn kẽ và đào sâu thêm về chủ đề **{topic_title}** để cậu dễ '
                    'nắm bắt hơn nhé:\n'
                    '\n'
                    '### 📌 1. Ý nghĩa & Tầm quan trọng của quy trình\n'
                    "- Quy trình nhập hàng là 'cửa ngõ' quyết định tính chính xác của toàn bộ dữ liệu kho. Nếu nhập "
                    'sai số lượng hoặc mã hàng ngay từ đầu, hệ thống sẽ bị sai dây chuyền, dẫn đến khâu xuất hàng bị '
                    'thiếu hụt hoặc đóng gói nhầm sản phẩm cho khách.\n'
                    '- Giúp công ty kiểm soát chất lượng đầu vào, kịp thời quy trách nhiệm bồi thường cho nhà cung cấp '
                    'hoặc bên vận chuyển nếu xảy ra hỏng hóc trước khi hàng vào kho lưu trữ.\n'
                    '\n'
                    '### 📘 Giải thích chi tiết từng bước & Thuật ngữ nghiệp vụ\n'
                    '- **Phiếu Giao Hàng (Delivery Note - DN):** Chứng từ giấy do nhà cung cấp cấp cho tài xế mang '
                    'theo. Trên phiếu ghi rõ tên sản phẩm, mã vạch (SKU) và số lượng bàn giao. Cậu phải đối chiếu mã '
                    'đơn mua hàng (PO - Purchase Order) trên hệ thống WMS để xem đơn hàng đã được duyệt nhập chưa.\n'
                    '- **Đồng kiểm vật lý (Double check):** Quá trình cậu và tài xế cùng đếm trực tiếp từng hộp hàng. '
                    'Tuyệt đối không đếm đại diện hoặc ước lượng bằng mắt. Đếm đến đâu ghi nhận trực tiếp đến đó.\n'
                    '- **Nhập hệ thống WMS:** Sau khi đếm xong, cậu dùng máy quét PDA quét mã vạch SKU trên từng sản '
                    'phẩm để hệ thống tự động cộng tồn kho ảo. Cuối cùng, xếp hàng lên Pallet và dùng xe nâng chuyển '
                    'vào đúng vị trí kệ lưu trữ được chỉ định trên máy PDA.\n'
                    '\n'
                    '### ⚠️ Các lỗi phổ biến & Cách phòng tránh\n'
                    '1. **Nhầm lẫn mã SKU tương đồng:** Nhiều sản phẩm có bao bì giống hệt nhau nhưng khác hương vị '
                    'hoặc kích thước (ví dụ: chai dầu gội 350ml và 500ml). *Cách phòng tránh:* Luôn đọc kỹ tem nhãn '
                    'chữ và quét mã vạch riêng lẻ từng loại, không quét một chai rồi nhân số lượng cho tất cả.\n'
                    '2. **Ký nhận khi chưa đồng kiểm xong:** Tài xế giục giã nên cậu ký bừa biên bản giao nhận. Cuối '
                    'ngày phát hiện thiếu hàng thì kho phải đền bù. *Cách phòng tránh:* Kiên quyết yêu cầu tài xế đợi '
                    'đồng kiểm xong mới ký nhận.\n'
                    '\n'
                    '### 💡 Mẹo làm việc nhanh & Hiệu quả từ Tùng\n'
                    '- Xếp riêng các nhóm hàng có cùng mã SKU ra các góc bến nhập trước khi đếm. Đếm đến thùng nào thì '
                    'dùng phấn viết một nét gạch chéo nhỏ lên thùng đó để tránh đếm trùng.\n'
                    '- Luôn chụp ảnh lại thùng hàng lúc vừa mở cửa thùng xe tải để làm bằng chứng trạng thái xếp hàng '
                    'của nhà cung cấp.',
 'shipping-goods': 'Tớ hiểu rồi, để tớ giải thích thật cặn kẽ và đào sâu thêm về chủ đề **{topic_title}** để cậu dễ '
                   'nắm bắt hơn nhé:\n'
                   '\n'
                   '### 📌 1. Ý nghĩa & Tầm quan trọng của quy trình\n'
                   '- Xuất hàng là khâu cuối cùng tiếp xúc với khách hàng. Bất kỳ lỗi sai sót nào ở khâu này (giao '
                   'thiếu, giao nhầm mã, đóng gói lỏng lẻo bể vỡ) đều trực tiếp hủy hoại uy tín thương hiệu và làm '
                   'tăng chi phí xử lý đơn hoàn hàng.\n'
                   '- Giúp duy trì nguyên tắc xoay vòng tồn kho, đảm bảo hàng cũ hơn luôn được bán ra trước để tránh '
                   'tồn đọng hàng hết hạn.\n'
                   '\n'
                   '### 📘 Giải thích chi tiết từng bước & Thuật ngữ nghiệp vụ\n'
                   '- **Picking List (Phiếu Nhặt Hàng):** Lệnh xuất hàng do hệ thống WMS xuất ra, chỉ định rõ tên sản '
                   'phẩm, số lượng và tọa độ kệ lưu trữ chính xác (ví dụ: Kệ A-Tầng 3-Ô 12). Cậu phải di chuyển đúng '
                   'vị trí kệ đó để nhặt hàng.\n'
                   '- **Quét PDA xác nhận:** Mỗi sản phẩm lấy ra khỏi kệ phải được quét mã vạch ngay lập tức trên máy '
                   "PDA để hệ thống trừ trực tiếp tồn kho thực tế và cập nhật đơn hàng thành 'Đã nhặt'.\n"
                   '- **Kiểm tra chéo (Double Check):** Hàng sau khi nhặt xong được đưa về bàn đóng gói, một nhân viên '
                   'đóng gói khác sẽ quét lại mã vạch một lần nữa để đối chiếu với hóa đơn mua hàng của khách trước '
                   'khi niêm phong dán nhãn vận đơn (Shipping Label).\n'
                   '\n'
                   '### ⚠️ Các lỗi phổ biến & Cách phòng tránh\n'
                   '1. **Nhặt sai vị trí kệ:** Lấy hàng ở kệ kế bên vì lười di chuyển hoặc nhìn nhầm mã tọa độ kệ. '
                   '*Cách phòng tránh:* Luôn kiểm tra đối chiếu mã vị trí kệ hiển thị trên PDA khớp 100% với biển báo '
                   'gắn trên khung sắt kệ hàng.\n'
                   '2. **Dán nhầm nhãn vận đơn:** Đóng gói xong nhiều hộp rồi mới dán nhãn hàng loạt dẫn đến dán nhầm '
                   'nhãn của khách A lên hộp hàng của khách B. *Cách phòng tránh:* Đóng gói xong hộp nào, in và dán '
                   'nhãn vận đơn cho khách đó ngay lập tức (quy tắc đóng đơn nào dán đơn đó).\n'
                   '\n'
                   '### 💡 Mẹo làm việc nhanh & Hiệu quả từ Tùng\n'
                   '- Sắp xếp lộ trình di chuyển nhặt hàng theo hình chữ U hoặc hình xương cá dọc theo lối đi để không '
                   'bị đi ngược đường hoặc bỏ sót kệ.\n'
                   '- Để sẵn băng keo và kéo dắt ở đai lưng quần để có thể đóng gói sơ bộ ngay khi nhặt hàng cồng '
                   'kềnh.',
 'damaged-goods': 'Tớ hiểu rồi, để tớ giải thích thật cặn kẽ và đào sâu thêm về chủ đề **{topic_title}** để cậu dễ nắm '
                  'bắt hơn nhé:\n'
                  '\n'
                  '### 📌 1. Ý nghĩa & Tầm quan trọng của quy trình\n'
                  '- Đây là quy trình bảo vệ quyền lợi tài chính tối cao của kho hàng. Việc phát hiện và lập biên bản '
                  'kịp thời giúp công ty từ chối thanh toán cho những sản phẩm bị hỏng trước khi vào kho, chuyển toàn '
                  'bộ trách nhiệm đền bù cho nhà cung cấp hoặc đơn vị vận chuyển.\n'
                  '- Ngăn chặn việc đưa hàng lỗi vào khu lưu trữ tốt, tránh trường hợp gửi nhầm hàng hỏng cho khách '
                  'hàng.\n'
                  '\n'
                  '### 📘 Giải thích chi tiết từng bước & Thuật ngữ nghiệp vụ\n'
                  '- **Lập Biên Bản Đồng Kiểm (Joint Inspection Report):** Biên bản pháp lý ghi nhận tình trạng hỏng '
                  'hóc vật lý của hàng hóa dưới sự chứng kiến của cả thủ kho (cậu) và tài xế giao hàng. Biên bản bắt '
                  'buộc phải có chữ ký của hai bên thì mới hợp lệ.\n'
                  '- **Chụp ảnh bằng chứng chuẩn:** Chụp rõ 3 yếu tố: Cận cảnh vết hỏng (để thấy lỗi gì), toàn cảnh '
                  'pallet/thùng hàng lỗi (để thấy mức độ lan rộng) và nhãn mã vạch/mã thùng hàng (để định danh sản '
                  'phẩm).\n'
                  '- **Khu Vực Biệt Trữ (Quarantine Area):** Khu vực được sơn vạch kẻ màu vàng/đen riêng biệt ở cuối '
                  'kho. Hàng lỗi sau khi lập biên bản phải được đưa về đây dán nhãn trạng thái chờ ban quản lý và nhà '
                  'cung cấp đối soát xử lý.\n'
                  '\n'
                  '### ⚠️ Các lỗi phổ biến & Cách phòng tránh\n'
                  '1. **Chữ ký tài xế không hợp lệ:** Tài xế ký nguệch ngoạc không ghi rõ họ tên hoặc dùng chữ ký giả '
                  'rồi bỏ đi. *Cách phòng tránh:* Yêu cầu tài xế viết rõ họ tên và số điện thoại, xuất trình căn '
                  'cước/giấy phép lái xe đối chiếu nếu cần.\n'
                  "2. **Quên cập nhật hệ thống:** Chỉ lập biên bản giấy mà quên không khai báo menu 'Hàng lỗi nhập' "
                  'trên phần mềm WMS, khiến hệ thống vẫn ghi nhận hàng tốt dẫn đến sai lệch tồn kho ảo. *Cách phòng '
                  'tránh:* Tạo thói quen cập nhật hệ thống ngay sau khi di chuyển hàng lỗi vào khu biệt trữ.\n'
                  '\n'
                  '### 💡 Mẹo làm việc nhanh & Hiệu quả từ Tùng\n'
                  '- Luôn chuẩn bị sẵn một tập biên bản đồng kiểm hàng hỏng kẹp trên bảng nhựa đặt ngay tại bến nhập '
                  'hàng.\n'
                  '- Sử dụng cuộn băng keo màu đỏ riêng biệt để quấn quanh các thùng hàng lỗi, giúp mọi người nhìn từ '
                  'xa là biết ngay hàng hỏng, không xếp nhầm lên kệ tốt.',
 'fragile-packaging': 'Tớ hiểu rồi, để tớ giải thích thật cặn kẽ và đào sâu thêm về chủ đề **{topic_title}** để cậu dễ '
                      'nắm bắt hơn nhé:\n'
                      '\n'
                      '### 📌 1. Ý nghĩa & Tầm quan trọng của quy trình\n'
                      '- Hàng dễ vỡ (gốm sứ, thủy tinh, mỹ phẩm chai lọ, linh kiện điện tử nhạy cảm) có tỷ lệ hư hỏng '
                      'cực cao trong khâu vận chuyển do các bưu cục chia chọn tự động thường ném hoặc chồng đè hàng '
                      'hóa.\n'
                      '- Đóng gói đúng chuẩn giúp giảm tỷ lệ bể vỡ xuống dưới 0.1%, tiết kiệm chi phí bồi thường và '
                      'tăng sự hài lòng của khách hàng khi mở hộp.\n'
                      '\n'
                      '### 📘 Giải thích chi tiết từng bước & Thuật ngữ nghiệp vụ\n'
                      '- **Xốp khí bong bóng (Bubble wrap):** Vật liệu giảm chấn chính. Cậu bắt buộc phải quấn tối '
                      'thiểu 3 lớp (dày khoảng 2cm) quanh sản phẩm. Các hạt bóng khí hướng vào phía trong sản phẩm để '
                      'ôm khít giảm chấn.\n'
                      '- **Hạt xốp/Giấy chèn lót:** Dùng để lấp đầy các khoảng trống bên trong thùng carton. Nguyên '
                      'tắc là sản phẩm không được chạm vào bất kỳ thành bên nào của thùng carton, luôn phải có lớp đệm '
                      'chèn xung quanh.\n'
                      '- **Gia cố băng keo chữ thập (+):** Dán băng keo chạy dọc nắp thùng và quấn vòng quanh thân đáy '
                      'thùng tạo thành hình chữ thập. Điều này giúp đáy thùng chịu được sức nặng và không bị bục ra '
                      'khi chịu lực đè lớn.\n'
                      '\n'
                      '### ⚠️ Các lỗi phổ biến & Cách phòng tránh\n'
                      '1. **Thùng carton quá mỏng hoặc quá chật:** Dùng thùng mỏng dễ móp hoặc thùng vừa khít sản phẩm '
                      'khiến sản phẩm tỳ trực tiếp vào thành thùng, chỉ cần va đập nhẹ bên ngoài là vỡ bên trong. '
                      '*Cách phòng tránh:* Luôn chọn thùng cứng (3 lớp hoặc 5 lớp) rộng hơn sản phẩm tối thiểu 5cm ở '
                      'mỗi chiều.\n'
                      '2. **Thiếu nhãn cảnh báo đỏ:** Không dán tem Hàng dễ vỡ bên ngoài khiến nhân viên bốc xếp hoặc '
                      "bưu tá vận chuyển quăng quật mạnh tay. *Cách phòng tránh:* Luôn dán ít nhất 2 tem màu đỏ 'HÀNG "
                      "DỄ VỠ' nổi bật ở mặt trên và mặt hông của thùng hàng.\n"
                      '\n'
                      '### 💡 Mẹo làm việc nhanh & Hiệu quả từ Tùng\n'
                      '- **Mẹo lắc thùng kiểm tra:** Sau khi đóng gói xong, nhấc thùng lên lắc mạnh. Nếu nghe thấy bất '
                      "kỳ tiếng 'lọc xọc' hay cảm giác sản phẩm di chuyển bên trong, tức là cậu chèn chưa đủ chặt. "
                      'Phải khui ra nhét thêm giấy/hạt xốp cho đến khi lắc không nghe tiếng gì mới đạt chuẩn.',
 'barcode-printer': 'Tớ hiểu rồi, để tớ giải thích thật cặn kẽ và đào sâu thêm về chủ đề **{topic_title}** để cậu dễ '
                    'nắm bắt hơn nhé:\n'
                    '\n'
                    '### 📌 1. Ý nghĩa & Tầm quan trọng của quy trình\n'
                    "- Mã vạch chính là 'chứng minh thư' định danh sản phẩm trong kho. Nếu tem in ra bị lệch, mờ, xước "
                    'hoặc nhăn, máy PDA sẽ không thể quét được mã vạch ở các khâu sau (nhập kệ, nhặt hàng, đóng gói), '
                    'dẫn đến tê liệt quy trình vận hành tự động.\n'
                    '- Giúp giảm thiểu lỗi nhập liệu bằng tay thủ công vốn có tỷ lệ sai sót lên tới 10%.\n'
                    '\n'
                    '### 📘 Giải thích chi tiết từng bước & Thuật ngữ nghiệp vụ\n'
                    '- **Giấy decal nhiệt & Mực Ribbon:** Giấy decal thường dạng cuộn có keo sẵn. Mực ribbon (thường '
                    'là ribbon Wax hoặc Wax-Resin) truyền nhiệt lên decal để tạo chữ/hình ảnh. Trục lắp cuộn mực '
                    'ribbon phải lắp đúng chiều (mặt mực úp xuống tiếp xúc với decal).\n'
                    '- **Phần mềm Bartender:** Phần mềm thiết kế tem chuẩn công nghiệp. Cậu chỉ cần nhập mã hàng SKU, '
                    'hệ thống sẽ tự động chuyển đổi thành hình ảnh mã vạch 1D hoặc mã QR 2D tương ứng.\n'
                    '- **Cân chỉnh (Calibrate) máy in:** Quá trình máy in tự quay giấy để mắt đọc (Sensor) nhận diện '
                    'khoảng trống giữa các tem (Gap) nhằm định vị điểm bắt đầu và kết thúc của một con tem một cách '
                    'chính xác.\n'
                    '\n'
                    '### ⚠️ Các lỗi phổ biến & Cách phòng tránh\n'
                    '1. **Lắp ngược mặt mực Ribbon:** Lắp cuộn mực ngược chiều khiến mặt có mực tiếp xúc trực tiếp với '
                    'thanh nhiệt đầu in thay vì giấy decal. Khi in nhiệt độ cao sẽ làm nóng chảy mực dính chặt vào đầu '
                    'in gây cháy hoặc hỏng đầu in. *Cách phòng tránh:* Dán thử một miếng băng keo nhỏ lên cuộn mực, '
                    'mặt nào dính mực đen bong ra thì mặt đó phải úp xuống decal.\n'
                    '2. **Tem in ra bị mờ hoặc mất nét:** Đầu in bị bám bụi carbon hoặc keo decal lâu ngày làm giảm '
                    'nhiệt lượng truyền xuống giấy. *Cách phòng tránh:* Tắt nguồn máy in, dùng tăm bông tẩm cồn 90 độ '
                    'lau nhẹ thanh nhiệt nằm dưới đầu in.\n'
                    '\n'
                    '### 💡 Mẹo làm việc nhanh & Hiệu quả từ Tùng\n'
                    '- Khi thay cuộn decal mới có kích thước khác, hãy nhấn giữ nút **FEED** trên máy in khoảng 3-4 '
                    'giây đến khi máy kêu tít và tự động chạy thử 2-3 tem để calibrate định vị khổ giấy mới, tránh bị '
                    'lệch tem in.',
 'safety-rules': 'Tớ hiểu rồi, để tớ giải thích thật cặn kẽ và đào sâu thêm về chủ đề **{topic_title}** để cậu dễ nắm '
                 'bắt hơn nhé:\n'
                 '\n'
                 '### 📌 1. Ý nghĩa & Tầm quan trọng của quy trình\n'
                 '- Kho hàng là môi trường năng động nhưng ẩn chứa nhiều rủi ro nghiêm trọng do có xe nâng di chuyển '
                 'liên tục, kệ hàng cao tầng chịu lực lớn và các pallet gỗ nặng nề dễ gây chấn thương.\n'
                 '- Tuân thủ quy tắc an toàn giúp bảo vệ tính mạng, sức khỏe của chính cậu và đồng nghiệp xung quanh, '
                 'đảm bảo kho vận hành ổn định không bị đình chỉ do tai nạn lao động.\n'
                 '\n'
                 '### 📘 Giải thích chi tiết từng bước & Thuật ngữ nghiệp vụ\n'
                 '- **Đồ bảo hộ bắt buộc (PPE):** Áo phản quang giúp tài xế xe nâng nhìn thấy cậu từ xa ít nhất 15 '
                 'mét. Giày bảo hộ mũi sắt chịu được lực va đập lên tới 200J (phòng pallet hoặc hàng nặng rơi trúng '
                 'ngón chân). Mũ bảo hiểm cứng bảo vệ đầu khi đứng dưới kệ cao.\n'
                 '- **Làn đường đi bộ (Green path):** Làn đường sơn màu xanh lá cây hoặc giới hạn bằng vạch kẻ vàng '
                 'nổi bật dành riêng cho người đi bộ. Xe nâng tuyệt đối không được lấn vào làn này.\n'
                 '- **Gương cầu lồi:** Treo tại các góc cua 90 độ của dãy kệ để mở rộng góc quan sát cho cả người đi '
                 'bộ và tài xế xe nâng tránh đâm va vào nhau.\n'
                 '\n'
                 '### ⚠️ Các lỗi phổ biến & Cách phòng tránh\n'
                 '1. **Chủ quan không mang bảo hộ:** Chỉ vào kho lấy 1 món đồ nhỏ trong 1 phút nên lười đi giày bảo hộ '
                 "hoặc áo phản quang. *Cách phòng tránh:* Nghiêm túc tuân thủ quy tắc 'Không bảo hộ - Không bước vào "
                 "kho' đối với mọi nhân viên và khách tham quan.\n"
                 '2. **Leo trèo kệ hàng:** Trèo lên khung sắt kệ để lấy hàng ở tầng 2-3 cho nhanh thay vì đi tìm '
                 'thang. Khung kệ có thể bị biến dạng hoặc trượt chân rơi xuống sàn bê tông. *Cách phòng tránh:* Bắt '
                 'buộc dùng thang xếp di động có khóa bánh xe hoặc báo tài xế xe nâng hỗ trợ hạ hàng xuống.\n'
                 '\n'
                 '### 💡 Mẹo làm việc nhanh & Hiệu quả từ Tùng\n'
                 '- Mỗi khi nghe tiếng còi xe nâng hoặc tiếng động cơ phát ra ở ngã rẽ kệ hàng, hãy lập tức dừng lại, '
                 'đứng nép sát vào chân kệ vững chãi và đợi xe nâng đi qua hẳn rồi mới di chuyển tiếp.',
 'inventory-counting': 'Tớ hiểu rồi, để tớ giải thích thật cặn kẽ và đào sâu thêm về chủ đề **{topic_title}** để cậu '
                       'dễ nắm bắt hơn nhé:\n'
                       '\n'
                       '### 📌 1. Ý nghĩa & Tầm quan trọng của quy trình\n'
                       '- Kiểm kê định kỳ giúp kiểm soát tính chính xác của dữ liệu tồn kho (Inventory Accuracy), phát '
                       'hiện sớm các hành vi mất mát, thất thoát hàng hóa hoặc hư hỏng hàng trong góc khuất kệ.\n'
                       "- Tránh hiện tượng 'tồn kho ảo' trên hệ thống khiến nhân viên bán hàng chốt đơn với khách "
                       'nhưng thực tế trong kho đã hết sạch hàng.\n'
                       '\n'
                       '### 📘 Giải thích chi tiết từng bước & Thuật ngữ nghiệp vụ\n'
                       '- **Đếm vật lý (Physical Counting):** Việc bốc dỡ trực tiếp sản phẩm ra khỏi pallet/kệ để đếm '
                       'chi tiết từng món. Tuyệt đối không đếm vỏ hộp carton lớn rồi tự nhân số lượng vì thực tế bên '
                       'trong vỏ hộp có thể trống rỗng hoặc thiếu hàng.\n'
                       '- **Đếm chéo (Double Blind Count):** Hai người độc lập đếm cùng một khu vực kệ mà không biết '
                       'trước số liệu đếm của nhau hoặc số liệu trên hệ thống. Cách này giúp triệt tiêu hoàn toàn lỗi '
                       'đếm sai do chủ quan cảm tính.\n'
                       '- **Biên bản chênh lệch đối soát:** Ghi chép rõ mã SKU, số liệu tồn kho hệ thống (System '
                       'Count) và số liệu thực đếm (Actual Count) cùng mức chênh lệch thừa/thiếu làm cơ sở để kế toán '
                       'kho đối chiếu tài chính.\n'
                       '\n'
                       '### ⚠️ Các lỗi phổ biến & Cách phòng tránh\n'
                       '1. **Tự ý sửa số liệu hệ thống:** Thấy số liệu đếm lệch so với PDA, tự ý gõ sửa lại số trên '
                       'PDA cho bằng khớp để hoàn thành ca sớm. Điều này làm mất dấu vết sai lệch gốc. *Cách phòng '
                       'tránh:* Chỉ ghi nhận số thực đếm vào biên bản giấy/PDA, để hệ thống tự động lưu trữ vết lệch '
                       'chờ cấp quản lý phê duyệt điều chỉnh.\n'
                       '2. **Đếm trùng hoặc đếm sót kệ:** Không phân chia ranh giới rõ ràng giữa các nhân viên cùng '
                       'kiểm kê một dãy kệ. *Cách phòng tránh:* Kiểm kê đến đâu, dán nhãn tròn đánh dấu màu đỏ lên vị '
                       'trí kệ đó đến đó.\n'
                       '\n'
                       '### 💡 Mẹo làm việc nhanh & Hiệu quả từ Tùng\n'
                       '- Đếm theo chiều cuốn chiếu: Từ trên xuống dưới, từ trái qua phải. Dùng bút dạ đỏ gạch nhẹ một '
                       'nét lên thùng carton đã đếm xong để người đếm sau biết thùng này đã được kiểm kê.',
 'returns-handling': 'Tớ hiểu rồi, để tớ giải thích thật cặn kẽ và đào sâu thêm về chủ đề **{topic_title}** để cậu dễ '
                     'nắm bắt hơn nhé:\n'
                     '\n'
                     '### 📌 1. Ý nghĩa & Tầm quan trọng của quy trình\n'
                     '- Hàng hoàn trả (Returns) nếu không quản lý tốt sẽ trở thành bãi rác khổng lồ trong kho, gây '
                     'lãng phí diện tích kệ và chôn vùi dòng tiền của công ty.\n'
                     '- Giúp phát hiện sớm các trường hợp khách hàng hoặc đơn vị vận chuyển gian lận, tráo đổi hàng '
                     'giả/hàng cũ nát vào hộp sản phẩm mới gửi về.\n'
                     '\n'
                     '### 📘 Giải thích chi tiết từng bước & Thuật ngữ nghiệp vụ\n'
                     '- **Quét đối chiếu mã vận đơn (Tracking ID):** Dùng máy PDA quét mã vạch dán trên hộp hàng hoàn '
                     'trả để hệ thống truy tìm ngược lại mã đơn hàng gốc (Order ID) xem có khớp thông tin đăng ký hoàn '
                     'hàng của khách không.\n'
                     '- **Phân loại chất lượng (Grading):** Chia hàng hoàn thành các cấp độ:\n'
                     '  - *Hàng Loại A:* Còn nguyên tem mác, hộp đẹp như mới -> Nhập lại kho để bán tiếp.\n'
                     '  - *Hàng Loại B:* Sản phẩm tốt nhưng hộp rách/xước nhẹ -> Chuyển sang bán thanh lý xả kho.\n'
                     '  - *Hàng Loại C:* Bị hỏng nặng, vỡ nát hoặc mất linh kiện -> Tách riêng biệt trữ chờ hủy hoặc '
                     'làm việc đền bù.\n'
                     '\n'
                     '### ⚠️ Các lỗi phổ biến & Cách phòng tránh\n'
                     '1. **Nhập nhầm hàng hỏng vào kho tốt:** Cẩu thả không mở hộp kiểm tra chất lượng bên trong mà '
                     'quét nhập kho thẳng hàng hoàn. Lô hàng đó sau đó lại được đóng gói gửi cho khách tiếp theo gây '
                     'khiếu nại nặng. *Cách phòng tránh:* Bắt buộc khui mở và kiểm tra ngoại quan 100% tất cả các hộp '
                     'hàng hoàn trả.\n'
                     '2. **Thất lạc linh kiện nhỏ:** Mở hộp hàng hoàn để kiểm tra trên bàn lộn xộn khiến các dây cáp, '
                     'sách hướng dẫn, ốc vít kèm theo bị rơi mất. *Cách phòng tránh:* Chuẩn bị sẵn khay nhựa chia ngăn '
                     'đặt tại bàn kiểm hàng hoàn trả để đặt linh kiện tháo rời.\n'
                     '\n'
                     '### 💡 Mẹo làm việc nhanh & Hiệu quả từ Tùng\n'
                     '- Sử dụng điện thoại thông minh kẹp cố định trên giá đỡ phía trên bàn kiểm hàng để quay video '
                     'toàn bộ quá trình khui mở hộp hàng hoàn trả, đây là bằng chứng thép khi làm việc đền bù với bưu '
                     'điện giao hàng.',
 'fifo-fefo': 'Tớ hiểu rồi, để tớ giải thích thật cặn kẽ và đào sâu thêm về chủ đề **{topic_title}** để cậu dễ nắm bắt '
              'hơn nhé:\n'
              '\n'
              '### 📌 1. Ý nghĩa & Tầm quan trọng của quy trình\n'
              '- FIFO và FEFO là hai nguyên tắc quản lý hàng tồn kho kinh điển giúp giảm thiểu hư hỏng và lãng phí tài '
              'chính:\n'
              '  - **FIFO (First In First Out):** Đảm bảo hàng hóa không nằm trong kho quá lâu dẫn đến hoen rỉ, bám '
              'bụi, lỗi thời (áp dụng cho hàng gia dụng, điện tử, thời trang).\n'
              '  - **FEFO (First Expired First Out):** Đảm bảo hàng cận date (gần hết hạn) luôn được bán trước để '
              'tránh việc phải tiêu hủy hàng hết hạn sử dụng gây lỗ vốn (áp dụng cho sữa, thực phẩm, mỹ phẩm, thuốc).\n'
              '\n'
              '### 📘 Giải thích chi tiết từng bước & Thuật ngữ nghiệp vụ\n'
              '- **Stock Rotation (Xoay vòng kệ hàng):** Kỹ thuật bắt buộc mỗi khi xếp hàng mới lên kệ. Cậu phải kéo '
              'toàn bộ sản phẩm cũ đang nằm sẵn trên kệ ra sát rìa ngoài, xếp các hộp hàng mới nhập vào góc sâu phía '
              'trong.\n'
              '- **Kiểm soát hạn sử dụng (Expiry Date Control):** Đọc nhãn phụ và phân nhóm date. Đối với lô hàng mới '
              'nhập có hạn sử dụng ngắn hơn lô hàng cũ đang có trên kệ (ví dụ: hàng cận date do nhà cung cấp xả kho), '
              'bắt buộc phải ưu tiên xuất lô cận date này đi trước (áp dụng FEFO).\n'
              '\n'
              '### ⚠️ Các lỗi phổ biến & Cách phòng tránh\n'
              '1. **Xếp đè hàng mới lên hàng cũ:** Lười kéo hàng cũ ra ngoài, nhân viên xếp thẳng lô hàng mới chặn ở '
              'rìa ngoài kệ. Nhân viên xuất hàng sẽ liên tục lấy hàng mới ở ngoài, khiến hàng cũ bên trong bị lưu kho '
              'quá hạn và phải hủy bỏ. *Cách phòng tránh:* Kiểm tra kệ và kéo hàng cũ ra ngoài trước khi xếp hàng mới '
              'lên.\n'
              '2. **Không kiểm tra date khi xuất hàng:** Chỉ lấy đại thùng hàng gần nhất để giao cho bưu tá mà không '
              'check xem hạn sử dụng còn bao lâu, dẫn đến gửi hàng hết hạn cho khách. *Cách phòng tránh:* Đối chiếu '
              'hạn sử dụng ghi trên lệnh xuất hàng với hạn sử dụng thực tế in trên thùng hàng trước khi lấy.\n'
              '\n'
              '### 💡 Mẹo làm việc nhanh & Hiệu quả từ Tùng\n'
              '- Dán một miếng giấy note màu sắc (màu đỏ: dưới 3 tháng, màu vàng: dưới 6 tháng) lên các Pallet/thùng '
              'hàng cận hạn sử dụng để nhân viên đi nhặt hàng nhìn thấy là ưu tiên bốc đi trước.',
 'fire-emergency': 'Tớ hiểu rồi, để tớ giải thích thật cặn kẽ và đào sâu thêm về chủ đề **{topic_title}** để cậu dễ '
                   'nắm bắt hơn nhé:\n'
                   '\n'
                   '### 📌 1. Ý nghĩa & Tầm quan trọng của quy trình\n'
                   '- Kho hàng chứa khối lượng cực lớn các vật liệu dễ bắt lửa (giấy carton đóng gói, hạt xốp chèn '
                   'lót, pallet gỗ khô, màng nilon bọc PE). Một đốm lửa nhỏ có thể bùng phát thành đám cháy khổng lồ '
                   'thiêu rụi toàn bộ kho hàng trong vòng vài phút.\n'
                   '- Việc nắm vững quy trình khẩn cấp giúp bảo vệ tính mạng bản thân, đồng nghiệp và giảm thiểu thiệt '
                   'hại tài sản cho doanh nghiệp.\n'
                   '\n'
                   '### 📘 Giải thích chi tiết từng bước & Thuật ngữ nghiệp vụ\n'
                   '- **Nút báo cháy khẩn cấp:** Hộp nhựa màu đỏ gắn trên tường tại các vị trí dễ thấy như cửa Exit, '
                   'cạnh tủ điện chính. Nhấn mạnh tay vào tấm kính giữa hộp để kích hoạt chuông báo động réo vang toàn '
                   'kho.\n'
                   '- **Sơ tán khẩn cấp (Evacuation):** Di chuyển nhanh chóng ra ngoài kho theo lối đi có gắn biển chỉ '
                   'dẫn EXIT màu xanh lá cây phát sáng. Tuyệt đối không mang theo hàng hóa hay tài sản cá nhân làm '
                   'chậm tốc độ di chuyển.\n'
                   '- **Nguyên tắc chữa cháy PASS:**\n'
                   '  - **P (Pull):** Rút chốt sắt khóa an toàn trên cổ bình chữa cháy.\n'
                   '  - **A (Aim):** Chĩa vòi phun thẳng vào gốc ngọn lửa (nơi phát sinh lửa), không chĩa vào ngọn lửa '
                   'bốc cao.\n'
                   '  - **S (Squeeze):** Bóp mạnh tay cầm bình chữa cháy.\n'
                   '  - **S (Sweep):** Quét vòi qua lại liên tục để phủ kín chất chữa cháy dập tắt lửa.\n'
                   '\n'
                   '### ⚠️ Các lỗi phổ biến & Cách phòng tránh\n'
                   '1. **Dùng sai bình chữa cháy:** Dùng bình nước dập đám cháy do chập điện (dễ gây giật điện tử '
                   'vong) hoặc cháy xăng dầu (nước làm dầu nổi lên và lan rộng đám cháy). *Cách phòng tránh:* Chỉ dùng '
                   'bình bột (bình ký hiệu ABC) hoặc bình khí CO2 cho các đám cháy điện và hóa chất.\n'
                   '2. **Cố chữa đám cháy quá lớn:** Đám cháy đã bốc cao quá đầu người nhưng vẫn cố đứng phun bình cứu '
                   'hỏa khiến bản thân bị ngạt khói độc. *Cách phòng tránh:* Đám cháy vượt quá diện tích 1 mét vuông '
                   'thì lập tức bỏ chạy, đóng cửa ngăn cháy lại và thoát ra ngoài.\n'
                   '\n'
                   '### 💡 Mẹo làm việc nhanh & Hiệu quả từ Tùng\n'
                   '- Đi khom lưng sát mặt đất khi sơ tán trong khu vực nhiều khói độc vì khói nóng chứa khí độc luôn '
                   'bốc lên cao, không khí sạch chứa oxy sẽ nằm sát mặt sàn kho.',
 'shift-handover': 'Tớ hiểu rồi, để tớ giải thích thật cặn kẽ và đào sâu thêm về chủ đề **{topic_title}** để cậu dễ '
                   'nắm bắt hơn nhé:\n'
                   '\n'
                   '### 📌 1. Ý nghĩa & Tầm quan trọng của quy trình\n'
                   '- Bàn giao ca là cầu nối đảm bảo thông tin thông suốt giữa các ca làm việc. Sai lệch thông tin khi '
                   'bàn giao ca (quên báo đơn hàng lỗi, thiết bị hỏng, đơn hàng khẩn) sẽ gây ra sự đình trệ vận hành '
                   'và tranh cãi đổ lỗi trách nhiệm giữa các ca.\n'
                   '- Giúp ca tiếp quản làm việc được ngay, không mất thời gian tìm hiểu lục lọi xem việc đang dừng ở '
                   'đâu.\n'
                   '\n'
                   '### 📘 Giải thích chi tiết từng bước & Thuật ngữ nghiệp vụ\n'
                   '- **Sổ Nhật Ký Giao Ca (Shift Handover Log):** Sổ ghi chép pháp lý ghi nhận tình trạng kho cuối ca '
                   'trực. Các mục bắt buộc phải ghi gồm: Tổng số đơn hoàn thành, danh sách đơn hàng nhặt dở dang kèm '
                   'vị trí kệ, các sự cố phát sinh (ví dụ: máy tính bị lỗi mạng, xe nâng kẹt bánh) và hàng chờ cách ly '
                   'biệt trữ chưa kiểm kê.\n'
                   '- **Bàn giao trực quan (Visual Handover):** Người giao dẫn người nhận ca trực tiếp đi một vòng qua '
                   'các bàn đóng gói, bến nhập xuất để chỉ rõ tình hình hàng hóa đang nằm ở đâu.\n'
                   '\n'
                   '### ⚠️ Các lỗi phổ biến & Cách phòng tránh\n'
                   '1. **Chỉ bàn giao miệng qua loa:** Nói nhanh vài câu rồi xách túi ra về, ca sau vào việc làm sai '
                   'sót vì quên hoặc nhớ nhầm. *Cách phòng tránh:* Nghiêm túc yêu cầu viết đầy đủ chi tiết vào Sổ bàn '
                   'giao ca và ký xác nhận hai bên.\n'
                   '2. **Không bàn giao sự cố thiết bị:** Máy in bị kẹt giấy hoặc PDA bị chai pin yếu không báo lại, '
                   'ca sau bắt đầu ca làm việc bị cuống vì thiết bị hỏng đột ngột. *Cách phòng tránh:* Ghi nhận mọi '
                   'lỗi thiết bị phát sinh vào sổ bàn giao và báo ngay cho kỹ thuật kho trước khi hết ca.\n'
                   '\n'
                   '### 💡 Mẹo làm việc nhanh & Hiệu quả từ Tùng\n'
                   '- Hãy dành 15 phút trước giờ hết ca để vệ sinh bàn đóng gói, trả dụng cụ về đúng kệ và điền sẵn '
                   'thông tin đơn hàng dở dang vào sổ. Tránh để đến đúng giờ đổi ca mới vội vàng ghi sổ sẽ dễ bị sót '
                   'thông tin.',
 'forklift-operation': 'Tớ hiểu rồi, để tớ giải thích thật cặn kẽ và đào sâu thêm về chủ đề **{topic_title}** để cậu '
                       'dễ nắm bắt hơn nhé:\n'
                       '\n'
                       '### 📌 1. Ý nghĩa & Tầm quan trọng của quy trình\n'
                       '- Xe nâng (Forklift) là công cụ đắc lực nhất giúp nâng đỡ di chuyển hàng pallet nặng hàng trăm '
                       'kg lên các kệ cao tầng, nhưng cũng là nguồn gây ra các vụ tai nạn lật kệ sập hàng cực kỳ nguy '
                       'hiểm nếu vận hành sai cách.\n'
                       '- Quy trình kiểm tra và lái xe an toàn giúp bảo vệ tính mạng của người vận hành, đồng nghiệp '
                       'xung quanh và tránh làm hỏng hóc đâm móp kệ hàng khung sắt.\n'
                       '\n'
                       '### 📘 Giải thích chi tiết từng bước & Thuật ngữ nghiệp vụ\n'
                       '- **Pre-use check (Kiểm tra trước khi dùng):** Kiểm tra các bộ phận cốt lõi trước mỗi ca: '
                       'Phanh xe nâng, còi báo động lùi, đèn pha, mức dầu thủy lực và xích nâng hàng xem có bị nứt '
                       'lỏng không.\n'
                       '- **Càng nâng & Khung nâng:** Khi chở hàng di chuyển, càng nâng phải được hạ sát mặt đất cách '
                       'sàn 15-20cm để trọng tâm xe thấp, và nghiêng khung nâng về phía cabin lái một góc nhẹ để '
                       'pallet tựa chắc vào giá đỡ tránh trôi hàng.\n'
                       '- **Góc cua điểm mù:** Do các dãy kệ tạo thành góc khuất che khuất tầm nhìn, tài xế bắt buộc '
                       'phải bóp còi ngắt quãng khi đi qua lối rẽ hoặc các tấm rèm ngăn nhựa.\n'
                       '\n'
                       '### ⚠️ Các lỗi phổ biến & Cách phòng tránh\n'
                       '1. **Chở người trên càng nâng:** Cho đồng nghiệp đứng lên càng nâng để đưa lên cao nhặt hàng '
                       '(cực kỳ nguy hiểm, dễ rơi trượt xuống đất tử vong). *Cách phòng tránh:* Tuyệt đối nghiêm cấm '
                       'chở người trên xe nâng dưới mọi hình thức, chỉ dùng càng để nâng Pallet hàng hóa.\n'
                       '2. **Chạy quá tốc độ quy định (Nguy cơ lật xe & sập kệ):** Chạy xe vội vã quá 10km/h để kịp '
                       'đơn hàng sẽ làm tăng quán tính cực lớn (xe nâng nặng từ 3-5 tấn). Khi gặp chướng ngại vật '
                       'phanh gấp, hàng hóa ở trên cao sẽ trượt tự do đổ ập xuống cabin lái hoặc đè người xung quanh. '
                       'Đặc biệt, ôm cua ở tốc độ cao kết hợp trọng tâm xe nâng cao rất dễ gây lật nghiêng xe nâng '
                       'hoặc đâm va làm sập kệ hàng khung sắt liên hoàn. *Cách phòng tránh:* Luôn nghiêm chỉnh chấp '
                       'hành giới hạn tốc độ tối đa 10km/h trên đường thẳng và 5km/h tại các góc rẽ, ngã tư.\n'
                       '\n'
                       '### 💡 Mẹo làm việc nhanh & Hiệu quả từ Tùng\n'
                       '- Khi chở hàng cồng kềnh xếp cao che khuất hoàn toàn tầm nhìn phía trước, cậu hãy di chuyển xe '
                       'bằng cách **đi lùi** chậm rãi và nhìn gương chiếu hậu để đảm bảo an toàn.',
 'cold-storage': 'Tớ hiểu rồi, để tớ giải thích thật cặn kẽ và đào sâu thêm về chủ đề **{topic_title}** để cậu dễ nắm '
                 'bắt hơn nhé:\n'
                 '\n'
                 '### 📌 1. Ý nghĩa & Tầm quan trọng của quy trình\n'
                 '- Kho lạnh bảo quản các sản phẩm dễ hỏng do nhiệt độ (rau quả tươi, thịt đông lạnh, hóa chất nhạy '
                 'cảm). Chỉ cần nhiệt độ lệch chuẩn vài độ trong 1 tiếng là toàn bộ lô hàng trị giá hàng trăm triệu có '
                 'thể bị vi khuẩn xâm nhập biến chất và phải hủy bỏ.\n'
                 '- Quy trình giúp bảo vệ sức khỏe nhân viên kho trước sốc nhiệt khi thay đổi môi trường đột ngột.\n'
                 '\n'
                 '### 📘 Giải thích chi tiết từng bước & Thuật ngữ nghiệp vụ\n'
                 '- **Hệ thống ba dải nhiệt độ tiêu chuẩn:**\n'
                 '  - *Kho mát:* 2 đến 8 độ C (rau củ, trái cây).\n'
                 '  - *Kho lạnh:* -2 đến 2 độ C (thịt, cá tươi, thực phẩm ngắn ngày).\n'
                 '  - *Kho đông:* -18 đến -25 độ C (hàng đông lạnh dài ngày).\n'
                 '- **Gioăng đệm cao su và Rèm ngăn nhiệt:** Tấm gioăng quanh viền cửa kho và rèm nhựa dẻo treo trước '
                 'lối ra vào giúp chặn không cho hơi ấm bên ngoài tràn vào làm tăng nhiệt độ kho.\n'
                 '- **Tuần hoàn khí lạnh:** Không khí lạnh phải được lưu thông tự do. Hàng hóa bắt buộc phải xếp cách '
                 'tường kho tối thiểu 10cm và không được xếp chồng che khuất quạt thổi của dàn lạnh.\n'
                 '\n'
                 '### ⚠️ Các lỗi phổ biến & Cách phòng tránh\n'
                 '1. **Mở toang cửa kho quá lâu:** Để cửa mở trong lúc bốc dỡ hàng để đỡ công đóng mở, làm nhiệt độ '
                 'kho tăng vọt và đọng sương chảy nước trên trần kho. *Cách phòng tránh:* Rút ngắn thời gian mở cửa, '
                 'kéo rèm nhựa kín và đóng cửa sập ngay sau mỗi lượt bốc hàng.\n'
                 '2. **Làm việc quá giờ trong kho đông:** Đứng kiểm hàng trong kho đông lạnh (-18 độ C) quá lâu mà '
                 'không có đồ bảo hộ chuyên dụng dẫn đến tê cóng tay chân. *Cách phòng tránh:* Nghiêm túc tuân thủ '
                 'giới hạn làm việc tối đa 30 phút liên tục trong kho đông, sau đó phải ra phòng đệm sưởi ấm 10 phút.\n'
                 '\n'
                 '### 💡 Mẹo làm việc nhanh & Hiệu quả từ Tùng\n'
                 '- Thường xuyên kiểm tra xem gioăng cửa kho có bị tuyết đóng băng bám dày cản trở việc đóng kín cửa '
                 'hay không. Dùng cào nhựa gạt sạch tuyết đóng viền cửa để đóng cửa khít 100%.',
 'order-reconciliation': 'Tớ hiểu rồi, để tớ giải thích thật cặn kẽ và đào sâu thêm về chủ đề **{topic_title}** để cậu '
                         'dễ nắm bắt hơn nhé:\n'
                         '\n'
                         '### 📌 1. Ý nghĩa & Tầm quan trọng của quy trình\n'
                         '- Đối soát đơn hàng là chốt chặn cuối cùng phát hiện các lỗi giao hàng nhầm, thất lạc đơn '
                         'hàng trước khi dữ liệu được đóng sổ chuyển qua bộ phận kế toán tài chính.\n'
                         '- Giúp phát hiện nhanh các kẽ hở trong quy trình nhặt hàng/đóng gói, xác định nguyên nhân '
                         'mất mát để kịp thời chấn chỉnh vận hành.\n'
                         '\n'
                         '### 📘 Giải thích chi tiết từng bước & Thuật ngữ nghiệp vụ\n'
                         '- **Order Summary Report (Báo cáo tổng hợp đơn):** File báo cáo xuất ra từ hệ thống WMS ghi '
                         'nhận toàn bộ lịch sử quét mã vạch xuất kho của các đơn hàng trong ngày.\n'
                         '- **Phiếu Giao Nhận Có Ký Xác Nhận (Signed Manifest):** Các biên bản giao hàng giấy có chữ '
                         'ký tươi xác nhận của tài xế hãng vận chuyển (bưu tá GHTK, GHN, Shopee...) chứng minh bưu tá '
                         'đã nhận thùng hàng đó từ kho.\n'
                         '- **Rà soát camera an ninh:** Khi đối chiếu phát hiện số liệu lệch (hệ thống báo xuất nhưng '
                         'bưu tá không ký nhận), cậu phải kiểm tra camera tại khu vực đóng gói/bàn giao theo khung giờ '
                         'quét đơn trên hệ thống để xác định vị trí thực tế của thùng hàng.\n'
                         '\n'
                         '### ⚠️ Các lỗi phổ biến & Cách phòng tránh\n'
                         '1. **Để dồn nhiều ngày mới đối soát:** Việc gom phiếu giấy nhiều ngày khiến cậu quên mất chi '
                         'tiết sự việc, và việc tìm lại camera cũ tốn rất nhiều thời gian. *Cách phòng tránh:* Bắt '
                         'buộc thực hiện đối soát đơn hàng đều đặn cuối mỗi ca làm việc trực tiếp.\n'
                         '2. **Bỏ qua sai lệch nhỏ:** Nghĩ lệch 1-2 đơn nhỏ không đáng kể nên tặc lưỡi bỏ qua, lâu '
                         'ngày tích tụ thành thất thoát lớn không tìm ra nguyên nhân. *Cách phòng tránh:* Mọi chênh '
                         'lệch dù chỉ 1 sản phẩm đều phải lập biên bản ghi nhận chênh lệch nộp sếp.\n'
                         '\n'
                         '### 💡 Mẹo làm việc nhanh & Hiệu quả từ Tùng\n'
                         '- Thiết lập một file excel đối soát chia sẻ chung (Google Sheets) để ca sáng và ca chiều cập '
                         'nhật trực tiếp mã đơn hàng bị lệch, giúp quản lý kho nắm bắt báo cáo tức thời.',
 'pda-device': 'Tớ hiểu rồi, để tớ giải thích thật cặn kẽ và đào sâu thêm về chủ đề **{topic_title}** để cậu dễ nắm '
               'bắt hơn nhé:\n'
               '\n'
               '### 📌 1. Ý nghĩa & Tầm quan trọng của thiết bị PDA trong kho\n'
               "- Máy PDA là 'vũ khí' cốt lõi giúp số hóa toàn bộ quy trình vận hành kho. Nhờ có PDA, tất cả các tác "
               'vụ từ nhập, xếp kệ, pick hàng, đóng gói đến kiểm kê đều được ghi nhận tức thời lên hệ thống WMS theo '
               'thời gian thực.\n'
               '- Giúp loại bỏ hoàn toàn các sai sót do nhập liệu thủ công bằng tay (tỷ lệ lỗi giảm từ 10% xuống dưới '
               '0.1%).\n'
               '\n'
               '### 📘 Giải thích chi tiết & Tính năng kỹ thuật\n'
               '- **Mắt quét Laser chuyên dụng:** Khác với camera điện thoại quét bằng hình ảnh (chậm và kén sáng), '
               'PDA sử dụng tia laser quét vật lý cực nhanh (chưa tới 0.1 giây), quét được cả mã vạch bị mờ, xước hoặc '
               'bọc màng PE bóng.\n'
               '- **Hệ điều hành tích hợp WMS:** PDA chạy trên hệ điều hành Android chuyên dụng, được cài đặt ứng dụng '
               'WMS của công ty để đồng bộ lệnh công việc trực tiếp từ máy chủ.\n'
               '- **Thiết kế công nghiệp siêu bền (Rugged device):** Có khả năng chống rơi vỡ từ độ cao 1.5m xuống sàn '
               'bê tông, chống bụi và nước đạt chuẩn IP65, hoạt động tốt trong cả kho đông lạnh.\n'
               '\n'
               '### ⚠️ Các sự cố thường gặp & Cách xử lý nhanh\n'
               '1. **Không quét được mã vạch:** Có thể do mắt kính quét bị bám bụi bẩn hoặc mã vạch sản phẩm bị rách '
               'nát hoàn toàn. *Cách xử lý:* Dùng khăn mềm lau sạch kính quét. Nếu mã vạch hỏng hẳn, hãy dùng bàn phím '
               'ảo trên PDA gõ tay mã số SKU ghi dưới vạch.\n'
               '2. **Mất kết nối Wi-Fi (Offline):** Khi di chuyển vào các góc sâu của kho hoặc khu biệt trữ, sóng '
               'Wi-Fi có thể bị yếu. *Cách xử lý:* Di chuyển ra vùng sóng khỏe hơn để máy tự động đồng bộ lại dữ liệu, '
               'tránh tắt máy làm mất dữ liệu quét dở dang.\n'
               '\n'
               '### 💡 Mẹo sử dụng & Bảo quản từ Tùng\n'
               '- Luôn đeo dây quấn cổ tay (Wrist strap) của PDA vào tay trong suốt ca làm việc để tránh vô tình làm '
               'rơi máy khi bốc dỡ hàng.\n'
               '- Cuối ca làm việc, hãy cắm trả PDA vào đế sạc (Cradle) đúng khớp sạc để đảm bảo pin được sạc đầy cho '
               'ca làm việc tiếp theo.'}

EXECUTION_GUIDES = {'receiving-goods': 'Tuyệt vời, khi cậu đã hiểu rõ quy trình nhập hàng, dưới đây là hướng dẫn thực hành chi tiết từng '
                    'bước để cậu bắt tay vào thực hiện ngay trên sàn kho nhé:\n'
                    '\n'
                    '### 📋 HƯỚNG DẪN CÁC BƯỚC THỰC HIỆN THỰC TẾ\n'
                    '\n'
                    '** Bước 1: Chuẩn bị trước khi hàng về**\n'
                    '- Mặc đầy đủ trang phục bảo hộ bắt buộc: **áo phản quang** và **giày mũi sắt**.\n'
                    '- Chuẩn bị sẵn dụng cụ: Máy quét PDA (đảm bảo đầy pin), kẹp tài liệu, bút mực, và sổ ghi chép '
                    'nhập hàng.\n'
                    '- Kiểm tra bến nhận hàng (Dock nhập), đảm bảo khu vực thông thoáng, không bị cản trở bởi pallet '
                    'rỗng.\n'
                    '\n'
                    '** Bước 2: Tiếp nhận và xác minh tài xế**\n'
                    '- Khi xe tải giao hàng tới bến, yêu cầu tài xế xuất trình **Phiếu Giao Hàng (Delivery Note)**.\n'
                    '- Đối chiếu nhanh thông tin trên phiếu giao hàng (tên nhà cung cấp, số đơn PO) với đơn đặt hàng '
                    'hiển thị trên phần mềm quản lý kho (WMS).\n'
                    '- Chỉ dẫn tài xế lùi xe vào bến an toàn, chèn bánh xe chắc chắn trước khi mở thùng xe.\n'
                    '\n'
                    '** Bước 3: Đồng kiểm số lượng vật lý**\n'
                    '- Cậu và tài xế cùng tiến hành bốc dỡ và đếm hàng. Đếm theo quy tắc **đếm từ trên xuống, từ trái '
                    'qua phải** của pallet.\n'
                    '- Ghi lại số lượng thực tế đếm được. So sánh trực tiếp với số lượng ghi trên Phiếu giao hàng.\n'
                    '- Nếu phát hiện thừa hoặc thiếu, ghi chú lại rõ ràng và yêu cầu tài xế xác nhận.\n'
                    '\n'
                    '** Bước 4: Kiểm tra chất lượng và phân loại**\n'
                    '- Quan sát ngoại quan từng thùng hàng: xem có bị rách, móp góc, ướt sũng hoặc mất tem niêm phong '
                    'không.\n'
                    '- Nếu có hàng hỏng, tách riêng ra khu vực biệt trữ và tiến hành chụp ảnh làm biên bản hàng lỗi '
                    'ngay (tuyệt đối không nhập chung với hàng tốt).\n'
                    '\n'
                    '** Bước 5: Ký biên bản giao nhận**\n'
                    '- Ghi rõ số lượng thực nhận (trừ đi số lượng thiếu hoặc hỏng nếu có) vào Biên bản giao nhận.\n'
                    '- Cả cậu và tài xế cùng ký tên, ghi rõ họ tên. Cậu giữ lại 1 liên chính để chuyển cho phòng kế '
                    'toán/đối soát, tài xế giữ 1 liên.\n'
                    '\n'
                    '** Bước 6: Nhập hệ thống WMS và lên kệ**\n'
                    '- Sử dụng máy PDA quét mã vạch sản phẩm để xác nhận số lượng thực tế nhập kho thành công.\n'
                    '- Vận chuyển hàng đến đúng vị trí kệ lưu trữ quy định. Quét mã vị trí kệ trên PDA để hệ thống ghi '
                    'nhận hàng đã lên kệ thành công.\n'
                    '\n'
                    '💡 **Lưu ý của Tùng:** Nhớ áp dụng nguyên tắc **FIFO/FEFO** khi xếp hàng lên kệ nhé - xếp hàng mới '
                    'ở phía trong, đẩy lô cũ ra ngoài.',
 'shipping-goods': 'Tuyệt vời, khi cậu đã hiểu rõ quy trình xuất hàng, dưới đây là hướng dẫn thực hành chi tiết từng '
                   'bước để cậu tiến hành nhặt và đóng gói đơn hàng chính xác nhé:\n'
                   '\n'
                   '### 📋 HƯỚNG DẪN CÁC BƯỚC THỰC HIỆN THỰC TẾ\n'
                   '\n'
                   '** Bước 1: Nhận lệnh và chuẩn bị**\n'
                   '- Nhận **Phiếu Nhặt Hàng (Picking List)** hoặc lệnh xuất trên màn hình máy quét PDA.\n'
                   '- Chuẩn bị dụng cụ: Xe đẩy hàng (hoặc xe nâng tay), máy PDA, băng keo, kéo và các kích thước thùng '
                   'carton phù hợp với đơn hàng.\n'
                   '\n'
                   '** Bước 2: Di chuyển nhặt hàng (Picking)**\n'
                   '- Di chuyển đến đúng vị trí kệ ghi trên Picking List. Hãy đi theo lộ trình tối ưu (theo lối đi '
                   'xương cá) để tiết kiệm thời gian.\n'
                   '- Áp dụng nguyên tắc **FIFO/FEFO**: Lấy các sản phẩm xếp ở mép ngoài kệ trước.\n'
                   '- So khớp chính xác tên sản phẩm, mã vạch (SKU) và số lượng. Dùng máy PDA quét mã vạch sản phẩm để '
                   "hệ thống chuyển trạng thái sang 'Đã nhặt'.\n"
                   '\n'
                   '** Bước 3: Kiểm tra ngoại quan sản phẩm**\n'
                   '- Trước khi bỏ vào xe đẩy, kiểm tra nhanh xem sản phẩm có bị xước, bẩn hay móp méo không. Nếu có '
                   'lỗi, đổi ngay sản phẩm khác trên kệ và báo hệ thống.\n'
                   '\n'
                   '** Bước 4: Đóng gói sản phẩm (Packing)**\n'
                   '- Mang hàng về bàn đóng gói. Chọn thùng carton có kích thước vừa vặn nhất.\n'
                   '- Bọc xốp bong bóng nếu là hàng dễ vỡ. Chèn hạt xốp hoặc giấy vụn vào các khoảng trống trong thùng '
                   'để hàng không bị dịch chuyển.\n'
                   '- Dán băng keo niêm phong thùng carton theo hình chữ thập (+).\n'
                   '\n'
                   '** Bước 5: Dán nhãn vận chuyển**\n'
                   '- In **Nhãn vận chuyển (Shipping Label)** từ phần mềm và dán phẳng lên mặt trên của thùng hàng. '
                   'Đảm bảo mã vạch vận đơn rõ nét, không bị nhăn hay bị băng keo đè che mất phần quét mã.\n'
                   '\n'
                   '** Bước 6: Kiểm tra chéo và Bàn giao**\n'
                   '- Nhờ đồng nghiệp check chéo nhanh đơn hàng (đúng mã, đúng số lượng) trước khi chất lên khu vực '
                   'chờ xuất.\n'
                   '- Bàn giao thùng hàng cho tài xế của đơn vị vận chuyển, yêu cầu ký nhận vào Biên bản bàn giao xuất '
                   'kho.\n'
                   '\n'
                   '💡 **Lưu ý của Tùng:** Luôn quét mã vạch ở từng bước nhặt hàng và đóng gói nhé. Quên quét một bước '
                   'là cuối ngày hệ thống báo lệch ngay đó.',
 'damaged-goods': 'Khi phát hiện hàng bị lỗi hoặc hỏng hóc trong lúc nhận hàng, dưới đây là các bước hành động thực tế '
                  'để cậu xử lý đúng quy chuẩn của kho:\n'
                  '\n'
                  '### 📋 HƯỚNG DẪN CÁC BƯỚC THỰC HIỆN THỰC TẾ\n'
                  '\n'
                  '** Bước 1: Cô lập kiện hàng lỗi**\n'
                  '- Ngay khi thấy thùng hàng bị móp méo, rách nát hoặc có vết ướt, hãy yêu cầu tài xế dừng bốc dỡ '
                  'kiện đó.\n'
                  '- Tách riêng kiện hàng lỗi ra một góc, tuyệt đối không được pha lẫn hoặc xếp lên kệ chung với các '
                  'kiện hàng tốt.\n'
                  '\n'
                  '** Bước 2: Chụp ảnh hiện trạng sắc nét**\n'
                  '- Sử dụng điện thoại di động chụp rõ nét tình trạng hư hỏng. Cần chụp tối thiểu 3 tấm ảnh:\n'
                  '  1. Ảnh cận cảnh vết rách/móp/ẩm ướt.\n'
                  '  2. Ảnh toàn cảnh thùng hàng để thấy được mức độ ảnh hưởng.\n'
                  '  3. Ảnh tem nhãn chứa mã vạch, mã SKU và tên sản phẩm trên thùng hàng.\n'
                  '\n'
                  '** Bước 3: Lập biên bản đồng kiểm hàng lỗi**\n'
                  '- Lấy mẫu **Biên bản đồng kiểm** giấy, điền đầy đủ các thông tin: Mã đơn hàng (PO), tên nhà cung '
                  'cấp, mã sản phẩm (SKU), số lượng thùng bị hỏng, và mô tả chi tiết tình trạng lỗi.\n'
                  '- Yêu cầu tài xế giao hàng cùng kiểm tra và ký xác nhận vào biên bản (ghi rõ họ tên).\n'
                  '\n'
                  '** Bước 4: Di chuyển về khu vực biệt trữ**\n'
                  "- Dán một tờ tem nhãn màu vàng có ghi chữ **'HÀNG LỖI - CHỜ XỬ LÝ'** lên kiện hàng.\n"
                  '- Dùng xe nâng tay di chuyển kiện hàng này về khu vực cách ly biệt trữ hàng lỗi (Quarantine Area) '
                  'cuối kho.\n'
                  '\n'
                  '** Bước 5: Báo cáo lên hệ thống quản lý WMS**\n'
                  "- Mở phần mềm quản lý kho trên máy tính hoặc PDA, vào menu 'Báo cáo sự cố/Hàng lỗi'.\n"
                  '- Nhập mã đơn PO, mã sản phẩm, điền số lượng lỗi và tải các bức ảnh đã chụp lên hệ thống để phòng '
                  'mua hàng làm việc với nhà cung cấp đổi trả.\n'
                  '\n'
                  '💡 **Lưu ý của Tùng:** Phải có chữ ký xác nhận của tài xế giao hàng trên biên bản đồng kiểm thì công '
                  'ty mình mới yêu cầu đền bù được nhé cậu.',
 'fragile-packaging': 'Dưới đây là các bước đóng gói hàng dễ vỡ chi tiết nhất để cậu thao tác trực tiếp tại bàn đóng '
                      'gói, đảm bảo hàng đi xa đến tay khách vẫn nguyên vẹn:\n'
                      '\n'
                      '### 📋 HƯỚNG DẪN CÁC BƯỚC THỰC HIỆN THỰC TẾ\n'
                      '\n'
                      '** Bước 1: Chuẩn bị vật tư đóng gói**\n'
                      '- Lấy cuộn xốp bong bóng khí (bubble wrap), cuộn băng keo bản lớn, dao rọc giấy.\n'
                      '- Chọn thùng carton cứng (loại 3 lớp hoặc 5 lớp) có kích thước rộng hơn sản phẩm mỗi chiều '
                      'khoảng 5-10cm.\n'
                      '- Chuẩn bị vật liệu chèn lót: hạt xốp, xốp hơi chống sốc hoặc giấy báo vò nát.\n'
                      '\n'
                      '** Bước 2: Quấn chống sốc sản phẩm**\n'
                      '- Đặt sản phẩm lên bàn, dùng xốp bong bóng khí quấn chặt quanh thân sản phẩm tối thiểu **3 '
                      'vòng** (đảm bảo độ dày lớp xốp đạt ít nhất 2cm).\n'
                      '- Chú ý bọc dày thêm ở các bộ phận nhô ra hoặc dễ gãy (như quai cốc, góc cạnh, phần đế nhọn).\n'
                      '- Dán băng keo cố định các nếp quấn.\n'
                      '\n'
                      '** Bước 3: Lót đáy thùng carton**\n'
                      '- Rải một lớp hạt xốp hoặc giấy chèn xuống đáy thùng carton với độ dày từ **3cm đến 5cm** để '
                      'tạo màng đệm giảm chấn động từ phía dưới.\n'
                      '\n'
                      '** Bước 4: Xếp hàng vào thùng**\n'
                      '- Đặt sản phẩm đã bọc xốp đứng thẳng vào giữa thùng carton. Tuyệt đối không đặt nằm ngang nếu '
                      'là chai lọ chứa chất lỏng.\n'
                      '- Nhét chặt hạt xốp hoặc giấy vụn vào toàn bộ các khoảng trống xung quanh sản phẩm và phía trên '
                      'nắp thùng. Đảm bảo sản phẩm không thể xê dịch khi thùng bị nghiêng.\n'
                      '\n'
                      '** Bước 5: Niêm phong thùng hàng**\n'
                      '- Gập nắp thùng lại, dán băng keo gia cố theo hình **chữ thập (+)** ở cả nắp trên và đáy dưới '
                      'thùng để gia tăng khả năng chịu lực.\n'
                      '\n'
                      '** Bước 6: Kiểm tra tiếng kêu và Dán nhãn cảnh báo**\n'
                      '- Nâng thùng hàng lên và lắc mạnh thử. Nếu nghe tiếng lọc xọc hoặc thấy sản phẩm bị trượt bên '
                      'trong, cậu phải khui ra chèn thêm xốp.\n'
                      "- Nếu không có tiếng động, dán nhãn màu đỏ có ghi **'HÀNG DỄ VỠ - NHẸ TAY'** ở mặt trên và mặt "
                      'hông của thùng hàng.\n'
                      '\n'
                      '💡 **Lưu ý của Tùng:** Nguyên tắc vàng là sản phẩm không được tiếp xúc trực tiếp với thành thùng '
                      'carton, luôn phải có lớp đệm ở giữa nha.',
 'barcode-printer': 'Dưới đây là quy trình thao tác từng bước vận hành máy in mã vạch và xử lý lỗi nhanh khi in tem '
                    'nhãn sản phẩm:\n'
                    '\n'
                    '### 📋 HƯỚNG DẪN CÁC BƯỚC THỰC HIỆN THỰC TẾ\n'
                    '\n'
                    '** Bước 1: Lắp giấy decal và mực ribbon**\n'
                    '- Tắt công tắc nguồn máy in. Mở nắp máy bằng cách nhấn 2 lẫy nhựa bên hông.\n'
                    '- Lắp cuộn giấy decal vào trục đỡ, điều chỉnh lẫy kẹp giấy sát vào mép decal nhưng không quá chặt '
                    'làm kẹt giấy.\n'
                    '- Lắp cuộn mực ribbon: cuộn mực mới lắp vào trục phía sau, cuộn thu hồi lắp vào trục phía trước. '
                    'Luồn mực đi dưới đầu in và dán cố định vào cuộn thu hồi.\n'
                    "- Ấn đầu in xuống cho đến khi nghe tiếng 'cạch' khóa chốt khóa máy.\n"
                    '\n'
                    '** Bước 2: Kết nối và Khởi động máy**\n'
                    '- Cắm cáp nguồn vào ổ điện và cáp USB kết nối trực tiếp với máy tính.\n'
                    "- Bật công tắc nguồn phía sau máy (chuyển sang vị trí 'I'). Đợi khoảng 10 giây cho đèn báo chuyển "
                    'sang màu **xanh lá đứng im**.\n'
                    '\n'
                    '** Bước 3: Tạo lệnh in trên máy tính**\n'
                    '- Mở phần mềm **Bartender** trên màn hình nền máy tính.\n'
                    '- Mở file mẫu tem (Template) có sẵn tương ứng với loại hàng cần in.\n'
                    '- Nhập thông tin: mã SKU sản phẩm, tên sản phẩm và số lượng tem cần in.\n'
                    '\n'
                    '** Bước 4: Thực hiện in thử (Test Print)**\n'
                    '- Trên phần mềm, chọn số lượng in là 1 tem và bấm lệnh in.\n'
                    '- Kiểm tra tem in ra: chữ và mã vạch phải sắc nét màu đen đậm, tem không bị lệch dòng, không bị '
                    'cắt đứt nửa tem.\n'
                    '\n'
                    '** Bước 5: Tiến hành in hàng loạt**\n'
                    '- Khi tem in test đạt chất lượng, nhập số lượng cần in thực tế và bấm lệnh in hàng loạt.\n'
                    '- Giám sát máy in để tránh tình trạng cuộn decal hoặc ribbon bị hết giữa chừng.\n'
                    '\n'
                    '🛠️ **Mẹo xử lý sự cố nhanh:**\n'
                    '- *Đèn nhấp nháy đỏ báo lỗi*: Nhấn giữ nút **FEED** trên máy in khoảng 3 giây để máy tự động đo '
                    'lại khoảng cách và căn chỉnh (Calibrate) khổ giấy.\n'
                    '- *Tem in ra bị mờ hoặc mất nét*: Do bụi bám vào đầu in. Tắt máy in, dùng tăm bông thấm cồn 90 độ '
                    'lau nhẹ qua bề mặt đầu in thanh nhiệt.',
 'safety-rules': 'An toàn của cậu là trên hết. Hãy thực hiện nghiêm ngặt các bước bảo hộ và quy tắc di chuyển sau đây '
                 'mỗi khi làm việc trong kho nhé:\n'
                 '\n'
                 '### 📋 HƯỚNG DẪN CÁC BƯỚC THỰC HIỆN THỰC TẾ\n'
                 '\n'
                 '** Bước 1: Mặc trang bị bảo hộ lao động (PPE) đầy đủ**\n'
                 '- Trước khi bước qua cửa kho, cậu phải trang bị:\n'
                 '  - **Áo phản quang**: Giúp xe nâng và các đồng nghiệp khác nhìn thấy cậu rõ ràng trong điều kiện '
                 'ánh sáng yếu.\n'
                 '  - **Giày bảo hộ mũi sắt**: Bảo vệ ngón chân tránh bị Pallet đè hoặc hàng nặng rơi trúng.\n'
                 '  - **Mũ bảo hiểm**: Bắt buộc khi cậu bước vào các dãy kệ cao tầng (từ tầng 3 trở lên).\n'
                 '\n'
                 '** Bước 2: Di chuyển đúng làn đường quy định**\n'
                 '- Luôn đi bộ bên trong làn đường được sơn vạch kẻ màu vàng/xanh dành riêng cho người đi bộ.\n'
                 '- Tuyệt đối không đi tắt qua các làn đường chính dành cho xe nâng đang chạy.\n'
                 '\n'
                 '** Bước 3: Quan sát tại các góc cua nguy hiểm**\n'
                 '- Khi đi đến các ngã rẽ hoặc góc khuất kệ hàng, hãy dừng lại 2 giây.\n'
                 '- Nhìn vào **gương cầu lồi** treo ở góc cua để xem có xe nâng đang đi tới hay không. Nếu nghe tiếng '
                 'còi xe nâng, hãy đứng nép sát vào thành kệ.\n'
                 '\n'
                 '** Bước 4: Quy tắc xếp dỡ hàng lên kệ**\n'
                 '- Luôn xếp hàng theo nguyên lý: **Hàng nặng xếp ở tầng dưới (tầng 1-2), hàng nhẹ xếp ở các tầng trên '
                 'cao**.\n'
                 '- Không xếp hàng vượt quá giới hạn chiều cao kệ quy định (mép hàng cách thanh đỡ trên ít nhất '
                 '10cm).\n'
                 '\n'
                 '** Bước 5: Sử dụng thang nâng chuyên dụng**\n'
                 '- Khi lấy hàng trên cao vượt tầm tay, hãy dùng thang xếp di động. Phải **khóa bánh xe** của thang '
                 'trước khi bước lên.\n'
                 '- Tuyệt đối không trèo leo lên khung sắt của kệ hàng hoặc đứng lên các pallet rỗng.\n'
                 '\n'
                 '** Bước 6: Giữ thông thoáng lối thoát hiểm**\n'
                 '- Không để Pallet rỗng, thùng hàng hoặc xe đẩy cản trở lối đi và khu vực cửa thoát hiểm (biển báo '
                 'EXIT).\n'
                 '\n'
                 '💡 **Lưu ý của Tùng:** Thấy xe nâng đang bốc hàng trên cao thì cậu tuyệt đối không được đi qua phía '
                 'dưới gầm càng nâng nhé. Tránh xa tối thiểu 3 mét.',
 'inventory-counting': 'Kiểm kê hàng tồn kho cần sự chính xác tuyệt đối. Dưới đây là các bước thao tác thực tế giúp '
                       'cậu đếm hàng nhanh và không bị nhầm lẫn:\n'
                       '\n'
                       '### 📋 HƯỚNG DẪN CÁC BƯỚC THỰC HIỆN THỰC TẾ\n'
                       '\n'
                       '** Bước 1: Nhận phiếu và chuẩn bị**\n'
                       '- Nhận **Phiếu kiểm kê (Inventory Sheet)** từ quản lý ca trực.\n'
                       '- Chuẩn bị dụng cụ: Bảng kẹp hồ sơ, bút bi mực màu đỏ (bắt buộc dùng mực đỏ để dễ phân biệt), '
                       'máy PDA quét mã vạch.\n'
                       '\n'
                       '** Bước 2: Di chuyển đến khu vực kiểm kê**\n'
                       '- Đi đến đúng dãy kệ được phân công trên phiếu.\n'
                       '- Tiến hành đếm theo thứ tự khoa học: **Từ kệ trái sang kệ phải, từ tầng trên cùng xuống tầng '
                       'dưới cùng** của mỗi dãy. Không nhảy cóc vị trí.\n'
                       '\n'
                       '** Bước 3: Thực hiện kiểm đếm thực tế (Physical Count)**\n'
                       '- Nhấc từng hộp hàng ra để đếm số lượng chi tiết bên trong, không đếm ước lượng bằng mắt qua '
                       'vỏ hộp carton.\n'
                       "- Ghi số lượng thực đếm được vào cột 'Thực tế' trên phiếu bằng bút mực đỏ.\n"
                       '\n'
                       '** Bước 4: Thực hiện đếm chéo lần 2**\n'
                       '- Sau khi đếm xong lần 1, hãy đổi phiếu kiểm kê với đồng nghiệp cùng dãy để tiến hành đếm chéo '
                       'độc lập lần 2.\n'
                       '- So sánh kết quả 2 lần đếm. Nếu lệch nhau, cả hai cùng đếm lại lần thứ 3 để chốt số chính xác '
                       'nhất.\n'
                       '\n'
                       '** Bước 5: Đối soát số liệu với hệ thống**\n'
                       '- Dùng máy PDA quét mã SKU của sản phẩm để xem số lượng tồn kho hiển thị trên phần mềm quản lý '
                       'kho (WMS) có khớp với số đỏ cậu vừa ghi hay không.\n'
                       '\n'
                       '** Bước 6: Lập biên bản chênh lệch và nộp báo cáo**\n'
                       '- Nếu phát hiện lệch (thừa/thiếu so với hệ thống), khoanh tròn mã hàng đó trên phiếu.\n'
                       '- Ký tên xác nhận cuối phiếu và nộp lại phiếu cho Quản lý kho. Tuyệt đối không tự ý điều chỉnh '
                       'số tồn kho trên hệ thống PDA khi chưa có lệnh duyệt của quản lý.\n'
                       '\n'
                       '💡 **Lưu ý của Tùng:** Gặp sản phẩm nào bị mất nhãn mã vạch hoặc rách hộp, hãy gom riêng ra và '
                       'ghi vào biên bản hàng chờ định danh nhé.',
 'returns-handling': 'Để xử lý các đơn hàng bị khách trả về một cách nhanh chóng và đúng quy định đối soát, cậu thực '
                     'hiện theo các bước sau:\n'
                     '\n'
                     '### 📋 HƯỚNG DẪN CÁC BƯỚC THỰC HIỆN THỰC TẾ\n'
                     '\n'
                     '** Bước 1: Tiếp nhận kiện hàng hoàn trả**\n'
                     '- Nhận các thùng hàng hoàn từ bưu tá của bên giao hàng.\n'
                     '- Dùng máy PDA quét **Mã vận đơn (Tracking ID)** dán bên ngoài hộp để xác định đơn hàng này có '
                     'thuộc danh sách hoàn hàng được phê duyệt trên hệ thống không.\n'
                     '\n'
                     '** Bước 2: Khui mở hộp và chụp ảnh kiểm tra**\n'
                     '- Dùng dao rọc giấy khui kiện hàng nhẹ tay. Khuyến khích cậu quay video mở hộp bằng điện thoại '
                     'để làm bằng chứng nếu hàng bên trong bị tráo đổi.\n'
                     '- Chụp ảnh hiện trạng bên trong thùng hàng ngay khi vừa mở nắp.\n'
                     '\n'
                     '** Bước 3: Đánh giá chất lượng sản phẩm chi tiết**\n'
                     '- Kiểm tra kỹ sản phẩm trả về theo các tiêu chí:\n'
                     '  - Có đúng sản phẩm của kho mình gửi đi không (so sánh số serial/mã IMEI nếu có).\n'
                     '  - Phụ kiện đi kèm, quà tặng kèm, sách hướng dẫn có đầy đủ không.\n'
                     '  - Vỏ hộp sản phẩm còn nguyên tem niêm phong không, có bị trầy xước hay rách nát không.\n'
                     '\n'
                     '** Bước 4: Phân loại chất lượng sản phẩm**\n'
                     '- Chia hàng hoàn thành 3 nhóm rõ ràng:\n'
                     '  - **Hàng Loại A (Mới 100%, nguyên tem)**: Đủ điều kiện bán lại.\n'
                     '  - **Hàng Loại B (Hỏng vỏ hộp, xước nhẹ)**: Chuyển sang khu vực chờ thanh lý giảm giá.\n'
                     '  - **Hàng Loại C (Hỏng nặng, bể vỡ hoặc bị tráo đổi)**: Giữ riêng ở khu biệt trữ lỗi để làm '
                     'việc đền bù với đơn vị vận chuyển hoặc khách hàng.\n'
                     '\n'
                     '** Bước 5: Cập nhật hệ thống WMS**\n'
                     '- Chọn đơn hàng tương ứng trên phần mềm WMS, chọn phân loại hàng hoàn (Loại A/B/C) và bấm xác '
                     'nhận nhập lại kho.\n'
                     '\n'
                     '** Bước 6: Sắp xếp hàng về vị trí kệ**\n'
                     '- Với hàng loại A, đưa về đúng vị trí kệ cũ và quét mã vị trí để hệ thống cộng lại tồn kho. Với '
                     'hàng Loại B và C, di chuyển về các khu vực kệ cách ly tương ứng.\n'
                     '\n'
                     '💡 **Lưu ý của Tùng:** Bước chụp hình sản phẩm hoàn trả rất quan trọng, nhớ chụp rõ các chi tiết '
                     'sản phẩm để tránh tranh chấp số liệu sau này nha.',
 'fifo-fefo': 'Nguyên tắc FIFO và FEFO giúp xoay vòng tồn kho hiệu quả, tránh hư hỏng hàng hóa. Dưới đây là các bước '
              'áp dụng trực tiếp khi cậu xếp kệ và nhặt hàng:\n'
              '\n'
              '### 📋 HƯỚNG DẪN CÁC BƯỚC THỰC HIỆN THỰC TẾ\n'
              '\n'
              '** Bước 1: Phân biệt nguyên tắc áp dụng cho hàng**\n'
              '- Khi tiếp nhận hàng từ bến nhập, kiểm tra danh mục hàng:\n'
              '  - **Áp dụng FEFO (Hết hạn trước - Xuất trước)**: Các loại thực phẩm, hóa mỹ phẩm, thực phẩm chức '
              'năng, nước uống... (hàng có hạn sử dụng).\n'
              '  - **Áp dụng FIFO (Nhập trước - Xuất trước)**: Đồ gia dụng, thiết bị điện tử, quần áo, sách vở... '
              '(hàng không có hạn sử dụng).\n'
              '\n'
              '** Bước 2: Kiểm tra date/ngày nhập kho**\n'
              '- Đọc kỹ hạn sử dụng (Expiry Date) dán trên nhãn thùng của lô hàng mới.\n'
              '- So sánh với hạn sử dụng của lô hàng đang có sẵn trên kệ lưu trữ.\n'
              '\n'
              '** Bước 3: Sắp xếp xoay vòng kệ hàng (Stock Rotation)**\n'
              '- Rút toàn bộ các hộp sản phẩm cũ đang nằm sẵn trên kệ ra phía sát mép ngoài (vị trí gần nhất tầm tay '
              'người lấy).\n'
              '- Đưa các hộp sản phẩm mới nhập về xếp vào vị trí phía trong cùng của kệ.\n'
              '- Đảm bảo các sản phẩm cũ quay mặt nhãn ghi hạn sử dụng ra ngoài để dễ nhìn thấy.\n'
              '\n'
              '** Bước 4: Dán nhãn theo dõi hạn sử dụng (Chỉ dành cho FEFO)**\n'
              '- Với các lô hàng sắp đến cận hạn sử dụng (dưới 3 tháng), dán một miếng tem tròn màu đỏ nổi bật ghi chữ '
              "**'FEFO'** bên ngoài hộp carton lớn chứa pallet.\n"
              '\n'
              '** Bước 5: Thực hiện nhặt hàng xuất kho**\n'
              '- Khi đi pick hàng, cậu bắt buộc phải lấy các sản phẩm ở hàng ngoài cùng trước. Tuyệt đối không được '
              'bốc lách lấy các hộp mới xếp ở sâu phía trong kệ.\n'
              '\n'
              "💡 **Lưu ý của Tùng:** Luôn ghi nhớ câu thần chú: **'Cũ ở ngoài - Mới ở trong'** mỗi khi đặt bất cứ kiện "
              'hàng nào lên kệ nhé cậu.',
 'fire-emergency': 'Sự cố cháy nổ đòi hỏi hành động nhanh chóng và chính xác. Hãy nhớ kỹ quy trình khẩn cấp 6 bước sau '
                   'đây để bảo vệ bản thân và đồng nghiệp:\n'
                   '\n'
                   '### 📋 HƯỚNG DẪN CÁC BƯỚC THỰC HIỆN THỰC TẾ\n'
                   '\n'
                   '** Bước 1: Kích hoạt báo động khẩn cấp**\n'
                   '- Ngay khi phát hiện khói, mùi khét hoặc ngọn lửa bùng phát, chạy nhanh đến **Nút báo cháy màu '
                   'đỏ** gần nhất treo trên tường (cạnh các cột chính hoặc cửa ra vào) và đập mạnh tay để kích hoạt '
                   'chuông báo động.\n'
                   "- Hét to: **'CHÁY! CHÁY! MỌI NGƯỜI SƠ TÁN NGAY!'**.\n"
                   '\n'
                   '** Bước 2: Gọi điện thoại báo cứu hỏa 114**\n'
                   '- Dùng điện thoại di động gọi ngay số **114**.\n'
                   '- Báo cáo rõ: Địa chỉ chính xác của kho hàng, mô tả sơ bộ đám cháy (ví dụ: cháy ở khu vực đóng '
                   'gói, nhiều giấy carton) và báo xem có ai bị kẹt bên trong hay không.\n'
                   '\n'
                   '** Bước 3: Ngắt nguồn điện khu vực**\n'
                   '- Nếu vị trí cầu dao điện tổng (Aptomat) ở khu vực an toàn và cậu đứng gần đó, hãy nhanh tay gạt '
                   'công tắc ngắt điện tổng của dãy kho để tránh chập cháy lan rộng.\n'
                   '\n'
                   '** Bước 4: Sơ tán người ra khỏi kho**\n'
                   '- Báo lại toàn bộ hàng hóa và tư trang cá nhân. Di chuyển nhanh theo hướng các bảng chỉ dẫn **EXIT '
                   '(lối thoát hiểm)** màu xanh lá cây phát sáng.\n'
                   '- Nếu có nhiều khói độc, hãy **khom lưng sát mặt đất** (khói nhẹ bay lên cao, sát mặt đất sẽ có '
                   'dưỡng khí) và dùng áo/khăn thấm nước che mũi miệng.\n'
                   '\n'
                   '** Bước 5: Tập trung và điểm danh**\n'
                   '- Di chuyển ra ngoài khu vực cổng chính của kho (vùng tập trung an toàn đã được quy định).\n'
                   '- Đứng theo hàng để quản lý ca trực tiến hành điểm danh nhanh, đảm bảo không có ai bị sót lại '
                   'trong kho.\n'
                   '\n'
                   '** Bước 6: Chữa cháy ban đầu (Chỉ khi đám cháy nhỏ)**\n'
                   '- Nếu đám cháy mới bùng phát, diện tích dưới 1 mét vuông và cậu tự tin biết dùng bình chữa cháy:\n'
                   '  - Chạy lấy bình chữa cháy gần nhất (bình bột hoặc bình khí CO2).\n'
                   '  - Giật mạnh chốt sắt khóa an toàn trên cổ bình.\n'
                   '  - Hướng vòi phun vào **gốc ngọn lửa** (không phun ngọn lửa ở trên cao).\n'
                   '  - Bóp mạnh tay cầm, quét vòi qua lại liên tục cho đến khi lửa tắt hoàn toàn.\n'
                   '\n'
                   '💡 **Lưu ý của Tùng:** Đám cháy lớn vượt quá tầm kiểm soát thì tuyệt đối không cố chữa cháy, hãy '
                   'chạy thoát thân ngay. Tính mạng là quan trọng nhất!',
 'shift-handover': 'Bàn giao ca đầy đủ giúp công việc kho diễn ra liên tục, không bị ngắt quãng hay nhầm lẫn số liệu. '
                   'Dưới đây là các bước bàn giao chuẩn:\n'
                   '\n'
                   '### 📋 HƯỚNG DẪN CÁC BƯỚC THỰC HIỆN THỰC TẾ\n'
                   '\n'
                   '** Bước 1: Dọn dẹp vệ sinh khu vực**\n'
                   '- Trước khi hết ca 20 phút, cậu quét dọn sạch bàn đóng gói/khu vực làm việc của mình.\n'
                   '- Gom rác carton, cuộn băng keo thừa vứt vào thùng rác. Đặt máy quét PDA, bút, kéo lại đúng kệ '
                   'dụng cụ.\n'
                   '\n'
                   '** Bước 2: Kiểm tra tiến độ đơn hàng**\n'
                   '- Đăng nhập phần mềm, kiểm tra danh sách đơn hàng đã xuất/nhập trong ca.\n'
                   '- Xác định rõ đơn nào đã hoàn thành 100%, đơn nào đang nhặt dở dang (ví dụ: nhặt được 4/10 sản '
                   'phẩm) để ca sau làm tiếp.\n'
                   '\n'
                   '** Bước 3: Kiểm tra khu vực hàng tồn chờ xử lý**\n'
                   '- Đi qua khu vực Quarantine (hàng lỗi) và khu vực hàng hoàn trả kiểm tra xem còn kiện hàng nào '
                   'chưa đối soát trên hệ thống không, ghi chú lại.\n'
                   '\n'
                   '** Bước 4: Ghi chép Sổ bàn giao ca (Shift Log)**\n'
                   '- Ghi vào sổ bàn giao các nội dung chính:\n'
                   '  - Số lượng đơn đã hoàn thành trong ca.\n'
                   '  - Mã số các đơn hàng đang xử lý dở dang.\n'
                   '  - Danh sách thiết bị gặp sự cố (ví dụ: máy in mã vạch kẹt giấy, xe nâng điện yếu bình).\n'
                   '  - Các lưu ý đặc biệt từ ban quản lý kho.\n'
                   '\n'
                   '** Bước 5: Trao đổi trực tiếp với ca sau**\n'
                   '- Khi người ca sau đến nhận việc, cậu hãy mở sổ bàn giao và trao đổi trực tiếp qua miệng.\n'
                   '- Dẫn đồng nghiệp ca sau đến vị trí kệ hoặc bàn làm việc có các đơn hàng đang dở dang để họ nắm '
                   'bắt trực quan.\n'
                   '\n'
                   '** Bước 6: Ký sổ xác nhận giao nhận ca**\n'
                   '- Cả cậu (người giao) và đồng nghiệp ca sau (người nhận) cùng ký tên xác nhận vào sổ bàn giao ca.\n'
                   '\n'
                   '💡 **Lưu ý của Tùng:** Việc ký sổ bàn giao ca giúp xác định rõ trách nhiệm công việc nếu chẳng may '
                   'xảy ra sai lệch số liệu hay hư hỏng thiết bị đó nha.',
 'forklift-operation': 'Vận hành xe nâng đòi hỏi sự tập trung tối đa để đảm bảo an toàn cho bản thân và mọi người. Cậu '
                       'hãy tuân thủ chính xác các bước vận hành sau:\n'
                       '\n'
                       '### 📋 HƯỚNG DẪN CÁC BƯỚC THỰC HIỆN THỰC TẾ\n'
                       '\n'
                       '** Bước 1: Kiểm tra chứng chỉ và phân công**\n'
                       '- Chỉ leo lên cabin xe nâng nếu cậu có **Chứng chỉ vận hành xe nâng** hợp lệ và được Quản lý '
                       'kho chỉ định trực tiếp.\n'
                       '\n'
                       '** Bước 2: Kiểm tra an toàn trước khi khởi động (Pre-check)**\n'
                       '- Đi một vòng quanh xe kiểm tra: lốp xe có bị xẹp không, xích nâng có bị lỏng không, gầm xe có '
                       'rò rỉ dầu thủy lực không.\n'
                       '- Leo lên xe, thắt dây an toàn, nổ máy và thử còi báo, phanh chân, phanh tay xem có hoạt động '
                       "nhạy không. Nếu phát hiện lỗi, tắt máy, treo biển báo 'HỎNG - CẤM DÙNG' và báo kỹ thuật.\n"
                       '\n'
                       '** Bước 3: Quy định di chuyển an toàn**\n'
                       '- Tốc độ tối đa cho phép trong kho là **10 km/h**.\n'
                       '- Luôn bấm còi xe tại mỗi góc cua, ngã rẽ hoặc khi đi qua rèm nhựa ngăn phòng.\n'
                       '- Khi di chuyển không có hàng hoặc có hàng, luôn hạ càng nâng thấp cách mặt đất từ **15cm đến '
                       '20cm**.\n'
                       '\n'
                       '** Bước 4: Thao tác nâng hàng từ kệ (Picking)**\n'
                       '- Tiến xe nâng vuông góc với kệ hàng. Đưa càng nâng vào tâm pallet thật chậm rãi.\n'
                       '- Nâng pallet lên cách mặt kệ khoảng 5cm.\n'
                       '- Nghiêng khung nâng về phía sau (phía cabin lái) khoảng 5-10 độ để hàng tựa chắc vào giá. Từ '
                       'từ lùi xe ra khỏi kệ và hạ hàng xuống độ cao di chuyển (15-20cm cách mặt đất).\n'
                       '\n'
                       '** Bước 5: Thao tác xếp hàng lên kệ (Putting)**\n'
                       '- Đưa xe nâng chứa hàng đến trước vị trí kệ cần xếp.\n'
                       '- Nâng pallet lên cao hơn thanh đỡ của kệ khoảng 10cm.\n'
                       '- Tiến xe từ từ cho pallet nằm cân đối phía trên thanh đỡ kệ. Trả khung nâng về vị trí thẳng '
                       'đứng. Hạ càng nâng xuống để pallet đặt hẳn lên kệ. Lùi xe nâng ra chậm rãi.\n'
                       '\n'
                       '** Bước 6: Tắt máy và đỗ xe đúng quy định**\n'
                       '- Hạ càng nâng sát xuống mặt đất, cài phanh tay chắc chắn.\n'
                       '- Tắt máy, rút chìa khóa xe nâng và đỗ xe đúng vị trí đỗ quy định. Tuyệt đối không đỗ xe cản '
                       'trở lối đi thoát hiểm.\n'
                       '\n'
                       '💡 **Lưu ý của Tùng:** Không bao giờ nâng hàng quá tải trọng tối đa ghi trên thân xe nâng, và '
                       'tuyệt đối không chở người trên càng nâng nhé cậu!',
 'cold-storage': 'Quản lý kho lạnh yêu cầu khắt khe về nhiệt độ và thời gian làm việc để đảm bảo chất lượng hàng và '
                 'sức khỏe của cậu. Hãy làm theo các bước sau:\n'
                 '\n'
                 '### 📋 HƯỚNG DẪN CÁC BƯỚC THỰC HIỆN THỰC TẾ\n'
                 '\n'
                 '** Bước 1: Chuẩn bị trang phục giữ ấm bắt buộc**\n'
                 '- Trước khi mở cửa bước vào kho lạnh, cậu bắt buộc phải mặc:\n'
                 '  - Áo khoác phao ấm dày chuyên dùng cho kho lạnh.\n'
                 '  - Găng tay giữ ấm chống nước.\n'
                 '  - Giày bảo hộ mũi sắt có đế cao su chống trượt tốt.\n'
                 '\n'
                 '** Bước 2: Kiểm tra nhiệt độ cài đặt của kho**\n'
                 '- Đọc nhiệt kế hiển thị bên ngoài cửa kho. Đảm bảo đúng chuẩn:\n'
                 '  - **Kho mát (rau củ, hoa quả)**: 2 độ C đến 8 độ C.\n'
                 '  - **Kho lạnh (hàng tươi sống)**: -2 độ C đến 2 độ C.\n'
                 '  - **Kho đông (hàng cấp đông)**: -18 độ C đến -25 độ C.\n'
                 '\n'
                 '** Bước 3: Di chuyển xếp dỡ hàng hóa đúng khoảng cách**\n'
                 '- Đóng cửa kho ngay sau khi xe đẩy hoặc người đi qua để tránh tổn hao nhiệt.\n'
                 '- Khi xếp hàng lên kệ trong kho lạnh, bắt buộc xếp **cách tường tối thiểu 10cm** và **cách sàn kho '
                 'ít nhất 15cm** (phải đặt hàng trên pallet). Quy tắc này giúp luồng khí lạnh tuần hoàn đều xung quanh '
                 'sản phẩm.\n'
                 '- Không xếp hàng che chắn các họng gió thổi của dàn lạnh.\n'
                 '\n'
                 '** Bước 4: Kiểm tra và ghi sổ nhiệt độ định kỳ**\n'
                 '- Cứ mỗi **2 giờ một lần**, cậu phải kiểm tra nhiệt kế của kho lạnh. Ghi nhận số liệu vào Biểu mẫu '
                 'theo dõi nhiệt độ treo trước cửa kho.\n'
                 '\n'
                 '** Bước 5: Giới hạn thời gian làm việc**\n'
                 '- Cậu không được làm việc trong kho đông lạnh (-18 độ C) quá **30 phút liên tục**.\n'
                 '- Sau 30 phút làm việc, phải ra ngoài khu vực đệm sưởi ấm cơ thể ít nhất 10 phút trước khi vào lại.\n'
                 '\n'
                 '** Bước 6: Báo cáo sự cố rò rỉ nhiệt**\n'
                 '- Nếu thấy nhiệt độ tăng cao vượt mức cho phép hoặc thấy tuyết đóng băng bám quá dày ở cửa kho, báo '
                 'ngay cho Quản lý kho để gọi bộ phận bảo trì sửa chữa.\n'
                 '\n'
                 '💡 **Lưu ý của Tùng:** Tuyệt đối không để cửa kho mở toang trong thời gian dài khi bốc dỡ hàng nhé, '
                 'hơi lạnh thoát ra sẽ làm hỏng toàn bộ sản phẩm bên trong đó.',
 'order-reconciliation': 'Đối soát đơn hàng cuối ngày giúp phát hiện sớm các sai sót nhập xuất kho để kịp thời xử lý. '
                         'Hãy thực hiện đối soát theo các bước sau:\n'
                         '\n'
                         '### 📋 HƯỚNG DẪN CÁC BƯỚC THỰC HIỆN THỰC TẾ\n'
                         '\n'
                         '** Bước 1: Xuất báo cáo từ hệ thống WMS**\n'
                         '- Vào cuối ca làm việc, đăng nhập tài khoản của cậu vào hệ thống quản lý kho WMS.\n'
                         "- Xuất báo cáo **'Danh sách đơn xuất kho trong ngày'** và **'Danh sách đơn nhập kho trong "
                         "ngày'** ra file Excel hoặc in ra giấy.\n"
                         '\n'
                         '** Bước 2: Thu thập các chứng từ giấy đối ứng**\n'
                         '- Gom toàn bộ các Phiếu giao nhận hàng (Delivery Notes) nhập kho và Phiếu xuất kho (Shipping '
                         'Manifests) có đầy đủ chữ ký xác nhận của tài xế giao hàng hoặc bên vận chuyển.\n'
                         '\n'
                         '** Bước 3: Thực hiện đối chiếu số liệu (Reconciliation)**\n'
                         '- So sánh chi tiết từng mã đơn hàng (Order ID) trên báo cáo hệ thống với phiếu giấy thực '
                         'tế:\n'
                         '  - Kiểm tra xem số lượng hàng thực tế xuất đi có khớp với số lượng hệ thống báo đã quét mã '
                         'vạch không.\n'
                         '  - Kiểm tra xem chữ ký của khách hàng hoặc bưu tá vận chuyển có bị thiếu ở đơn nào không.\n'
                         '\n'
                         '** Bước 4: Xử lý và ghi chú lỗi sai lệch**\n'
                         '- Nếu phát hiện đơn hàng có số lượng chênh lệch (ví dụ: hệ thống báo xuất 5 nhưng phiếu giấy '
                         'ký nhận chỉ có 4):\n'
                         '  - Đánh dấu bút dạ màu vàng lên dòng đơn hàng đó.\n'
                         '  - Kiểm tra thông tin người trực tiếp pick/đóng đơn hàng đó để hỏi lại.\n'
                         '  - Đi đếm lại lượng tồn kho thực tế trên kệ của mã hàng đó xem có bị thừa ra 1 sản phẩm '
                         'không.\n'
                         '\n'
                         '** Bước 5: Lập báo cáo chênh lệch đối soát**\n'
                         '- Viết một Biên bản giải trình đối soát ngắn, liệt kê các đơn bị lệch số lượng kèm nguyên '
                         'nhân nghi ngờ (nếu có).\n'
                         '\n'
                         '** Bước 6: Trình ký quản lý và Lưu trữ**\n'
                         '- Nộp báo cáo đối soát và biên bản lệch cho Quản lý kho duyệt.\n'
                         '- Kẹp toàn bộ chứng từ giấy đã đối soát khớp 100% vào cặp tài liệu lưu trữ của tháng.\n'
                         '\n'
                         '💡 **Lưu ý của Tùng:** Làm đối soát đều đặn cuối mỗi ca sẽ giúp kho mình không bị mất mát '
                         'hàng hóa và phát hiện nhanh các lỗi bốc nhầm hàng của nhân viên đó cậu.',
 'pda-device': 'Khi sử dụng máy quét cầm tay PDA để làm việc trong kho, dưới đây là các bước vận hành chuẩn để cậu làm '
               'việc hiệu quả và bảo quản thiết bị tốt nhé:\n'
               '\n'
               '### 📋 HƯỚNG DẪN CÁC BƯỚC THỰC HIỆN THỰC TẾ\n'
               '\n'
               '** Bước 1: Khởi động và kiểm tra đầu ca**\n'
               '- Nhận máy PDA được bàn giao từ tủ thiết bị hoặc từ ca trước.\n'
               '- Kiểm tra pin trên màn hình (đảm bảo pin >80% để làm việc cả ca, nếu pin yếu hãy đổi pin dự phòng '
               'hoặc đổi máy).\n'
               '- Kiểm tra mắt quét laser xem có sạch không, nếu mờ bụi hãy lau nhẹ bằng khăn mềm.\n'
               '\n'
               '** Bước 2: Đăng nhập hệ thống**\n'
               '- Bật kết nối Wi-Fi của máy và mở ứng dụng quản lý kho WMS.\n'
               '- Đăng nhập bằng tài khoản cá nhân được cấp. Kiểm tra ca làm việc và phân khu làm việc được chỉ định '
               'trên phần mềm.\n'
               '\n'
               '** Bước 3: Thực hiện quét mã (Nhập/Xuất/Kiểm kê)**\n'
               '- Khi quét mã sản phẩm hoặc mã kệ, chĩa mắt quét laser vào mã vạch ở khoảng cách 15-25 cm.\n'
               '- Nhấn giữ nút quét (nút màu cam ở hai bên sườn máy hoặc nút bấm cò súng).\n'
               "- Đợi máy phát tiếng kêu 'Tít' và màn hình hiển thị viền xanh lá (hoặc thông báo thành công). Nếu máy "
               "báo 'Tít tít' liên tục và viền đỏ tức là quét lỗi hoặc sai mã hàng.\n"
               '\n'
               '** Bước 4: Xử lý khi gặp mã lỗi**\n'
               "- Nếu mã vạch bị rách, xước không quét được, hãy chọn tính năng 'Nhập tay' trên WMS và gõ dãy ký tự "
               'SKU/mã vạch ghi dưới tem.\n'
               '- Nếu PDA báo mất mạng (Offline), di chuyển ra khu vực thông thoáng gần bộ phát Wi-Fi để dữ liệu được '
               'đồng bộ ngay lập tức.\n'
               '\n'
               '** Bước 5: Bàn giao cuối ca**\n'
               '- Đăng xuất tài khoản khỏi phần mềm WMS để bảo mật.\n'
               '- Lau sạch bụi bẩn trên thân máy PDA và cắm trả máy vào đế sạc (Cradle) đúng khớp sạc.\n'
               '\n'
               '💡 **Lưu ý của Tùng:** Luôn đeo dây bảo hiểm cổ tay khi cầm máy để tránh lỡ tay làm rơi vỡ nhé. Máy PDA '
               'rất đắt tiền đó cậu!'}

STEP_EXPLANATIONS = {'receiving-goods': {1: '**Bước 1: Tiếp nhận xe hàng & Kiểm tra chứng từ**\n'
                        '\n'
                        '- **Mục tiêu**: Xác thực tính hợp lệ của đơn hàng trước khi cho xe tải mở thùng bốc dỡ hàng.\n'
                        '- **Nghiệp vụ chi tiết**:\n'
                        '  - Yêu cầu tài xế xuất trình **Phiếu Giao Hàng (Delivery Note - DN)** giấy.\n'
                        '  - Đối chiếu mã PO (Purchase Order) và tên nhà cung cấp ghi trên phiếu với đơn đặt hàng hiển '
                        'thị trên phần mềm quản lý kho (WMS).\n'
                        "  - Đảm bảo trạng thái PO là 'Đã được duyệt nhập' (Approved) thì mới tiến hành nhận hàng.\n"
                        '- **⚠️ Lỗi thường gặp**: Cho xe tải vào bến và bốc dỡ khi chưa đối chiếu PO, cuối ca phát '
                        'hiện nhà cung cấp giao sai địa chỉ kho hoặc đơn PO chưa được ban giám đốc duyệt mua.\n'
                        '- **💡 Lời khuyên từ Tùng**: Luôn đọc kỹ tên nhà cung cấp trên phiếu giao hàng và chỉ dẫn tài '
                        'xế lùi xe đúng vị trí bến nhập quy định nhé.',
                     2: '**Bước 2: Đồng kiểm số lượng vật lý**\n'
                        '\n'
                        '- **Mục tiêu**: Ghi nhận chính xác số lượng hàng thực tế bàn giao từ tài xế.\n'
                        '- **Nghiệp vụ chi tiết**:\n'
                        '  - Cậu và tài xế cùng tiến hành bốc dỡ và đếm trực tiếp từng hộp hàng hoặc pallet.\n'
                        '  - Thực hiện theo quy tắc **đếm cuốn chiếu** (đếm từ trên xuống, từ trái sang phải).\n'
                        '  - Đếm đến đâu, dùng nét phấn gạch nhẹ lên thùng để tránh đếm trùng hoặc đếm sót.\n'
                        '- **⚠️ Lỗi thường gặp**: Đếm đại diện một vài thùng rồi nhân số lượng lên. Cách này rất dễ bỏ '
                        'sót các thùng rỗng bên trong pallet.\n'
                        '- **💡 Lời khuyên từ Tùng**: Tuyệt đối không đếm ước lượng bằng mắt. Hãy đếm thật kỹ cùng tài '
                        'xế để sau này nếu thiếu hàng thì tài xế không chối được.',
                     3: '**Bước 3: Kiểm tra chất lượng ngoại quan**\n'
                        '\n'
                        '- **Mục tiêu**: Loại bỏ hàng lỗi, hỏng hóc từ phía nhà cung cấp trước khi nhập kho lưu trữ.\n'
                        '- **Nghiệp vụ chi tiết**:\n'
                        '  - Quan sát ngoại quan từng thùng hàng: xem có bị rách, móp góc, ướt sũng hoặc mất tem niêm '
                        'phong không.\n'
                        '  - Khui ngẫu nhiên một số hộp để kiểm tra xem sản phẩm bên trong có bị bể vỡ hoặc biến dạng '
                        'không.\n'
                        '- **⚠️ Lỗi thường gặp**: Bỏ qua các vết ướt nhỏ trên thùng hàng, sau vài ngày nước ngấm làm '
                        'hỏng hàng loạt sản phẩm bên trong.\n'
                        '- **💡 Lời khuyên từ Tùng**: Phát hiện thùng nào bị rách móp nặng hoặc ẩm ướt, hãy cô lập ngay '
                        'và chuyển sang quy trình xử lý hàng lỗi để lập biên bản nhé.',
                     4: '**Bước 4: Ký biên bản nhận hàng**\n'
                        '\n'
                        '- **Mục tiêu**: Xác thực mặt pháp lý số lượng hàng thực tế nhập kho giữa hai bên.\n'
                        '- **Nghiệp vụ chi tiết**:\n'
                        '  - Ghi nhận số lượng thực tế nhận được (trừ đi số lượng thiếu hoặc hỏng) vào Biên bản giao '
                        'nhận giấy.\n'
                        '  - Cả cậu và tài xế cùng ký tên và ghi rõ họ tên.\n'
                        '  - Phân chia chứng từ: Kho giữ 1 bản chính để nộp kế toán, tài xế giữ 1 liên để làm việc với '
                        'nhà cung cấp.\n'
                        '- **⚠️ Lỗi thường gặp**: Tài xế giục giã nên cậu ký bừa biên bản giao nhận khi chưa kiểm đếm '
                        'xong. Cuối ngày phát hiện thiếu hàng thì kho phải đền bù.\n'
                        '- **💡 Lời khuyên từ Tùng**: Hãy kiên quyết yêu cầu tài xế đợi kiểm đếm xong mới được ký nhận. '
                        'Chữ ký của tài xế phải rõ nét và ghi rõ họ tên nha.',
                     5: '**Bước 5: Nhập hệ thống WMS & Sắp xếp lên kệ**\n'
                        '\n'
                        '- **Mục tiêu**: Cập nhật tồn kho thực tế lên hệ thống phần mềm và đưa hàng vào khu lưu trữ '
                        'tốt.\n'
                        '- **Nghiệp vụ chi tiết**:\n'
                        '  - Dùng máy PDA quét mã vạch SKU của từng loại sản phẩm để hệ thống tự động cập nhật tồn kho '
                        'ảo.\n'
                        '  - Di chuyển pallet hàng đến đúng tọa độ kệ lưu trữ được chỉ định trên màn hình máy PDA.\n'
                        '  - Quét mã vị trí kệ trên PDA để hoàn tất thao tác lưu kho.\n'
                        '- **⚠️ Lỗi thường gặp**: Nhập nhầm mã SKU tương đồng hoặc xếp hàng sai tọa độ kệ chỉ định '
                        'khiến sau này nhân viên xuất hàng đi tìm không thấy.\n'
                        '- **💡 Lời khuyên từ Tùng**: Xếp đúng vị trí kệ được chỉ định giúp hệ thống quản lý chính xác, '
                        'sau này đi nhặt hàng cũng sẽ nhanh hơn rất nhiều.'},
 'shipping-goods': {1: '**Bước 1: Nhận lệnh xuất & Chuẩn bị dụng cụ**\n'
                       '\n'
                       '- **Mục tiêu**: Chuẩn bị đầy đủ thông tin đơn hàng và phương tiện làm việc trước khi nhặt '
                       'hàng.\n'
                       '- **Nghiệp vụ chi tiết**:\n'
                       '  - Nhận **Phiếu Nhặt Hàng (Picking List)** hoặc nhận lệnh trực tiếp trên máy PDA.\n'
                       '  - Chuẩn bị dụng cụ: Xe đẩy hàng (hoặc xe nâng tay), máy PDA, băng keo, kéo và các loại thùng '
                       'carton phù hợp.\n'
                       '- **⚠️ Lỗi thường gặp**: Không chuẩn bị sẵn thùng carton và băng keo, di chuyển đến kệ hàng '
                       'rồi mới quay lại lấy làm tốn thời gian di chuyển.\n'
                       '- **💡 Lời khuyên từ Tùng**: Nhớ kiểm tra xem pin máy PDA đã được sạc đầy chưa để tránh bị sập '
                       'nguồn giữa chừng nhé.',
                    2: '**Bước 2: Di chuyển nhặt hàng (Picking)**\n'
                       '\n'
                       '- **Mục tiêu**: Lấy đúng sản phẩm, đúng số lượng từ đúng tọa độ kệ lưu trữ.\n'
                       '- **Nghiệp vụ chi tiết**:\n'
                       '  - Di chuyển đến kệ hàng có tọa độ ghi trên Picking List.\n'
                       '  - Áp dụng nguyên tắc **FIFO/FEFO**: Lấy hàng xếp ở mép ngoài kệ trước.\n'
                       "  - So khớp mã SKU và quét mã vạch sản phẩm trên PDA để hệ thống xác nhận 'Đã nhặt'.\n"
                       '- **⚠️ Lỗi thường gặp**: Nhặt sai vị trí kệ, lấy nhầm mã sản phẩm tương đồng vì lười so sánh '
                       'chi tiết nhãn mác.\n'
                       '- **💡 Lời khuyên từ Tùng**: Lên lộ trình nhặt hàng theo hình chữ U hoặc hình xương cá dọc theo '
                       'lối đi để tiết kiệm quãng đường đi lại.',
                    3: '**Bước 3: Đóng gói & Kiểm tra ngoại quan**\n'
                       '\n'
                       '- **Mục tiêu**: Bảo vệ hàng hóa an toàn tối đa và loại bỏ lỗi chất lượng vỏ ngoài trước khi '
                       'xuất đi.\n'
                       '- **Nghiệp vụ chi tiết**:\n'
                       '  - Kiểm tra ngoại quan sản phẩm xem có bị xước, bẩn, móp méo hay cận hạn sử dụng không.\n'
                       '  - Đặt sản phẩm đứng thẳng vào chính giữa thùng carton cứng phù hợp kích thước.\n'
                       '  - Chèn lót các khoảng trống xung quanh sản phẩm bằng hạt xốp hoặc giấy vụn.\n'
                       '- **⚠️ Lỗi thường gặp**: Cẩu thả bỏ qua vỏ sản phẩm bị móp/rách góc, gửi cho khách gây khiếu '
                       'nại hoàn đơn hàng.\n'
                       '- **💡 Lời khuyên từ Tùng**: Nguyên tắc là sản phẩm không được chạm vào thành thùng carton, '
                       'luôn phải có lớp đệm chèn xung quanh.',
                    4: '**Bước 4: Kiểm tra chéo đơn hàng**\n'
                       '\n'
                       '- **Mục tiêu**: Tránh hoàn toàn việc đóng nhầm hàng, thiếu hàng gửi khách.\n'
                       '- **Nghiệp vụ chi tiết**:\n'
                       '  - Hàng sau khi đóng gói sơ bộ được đưa về bàn đối soát cuối.\n'
                       '  - Một nhân viên khác sẽ quét lại mã vạch sản phẩm và đối chiếu với hóa đơn mua hàng của '
                       'khách.\n'
                       '  - Xác nhận khớp 100% rồi mới tiến hành niêm phong dán băng keo.\n'
                       '- **⚠️ Lỗi thường gặp**: Bỏ qua bước kiểm tra chéo vì đơn hàng quá tải, dán nhầm nhãn đơn '
                       'khách hàng A sang thùng hàng khách hàng B.\n'
                       '- **💡 Lời khuyên từ Tùng**: Luôn đóng đơn nào dán nhãn vận đơn cho đơn đó ngay lập tức để '
                       'tránh nhầm lẫn.',
                    5: '**Bước 5: Bàn giao vận chuyển & Ký nhận**\n'
                       '\n'
                       '- **Mục tiêu**: Chuyển giao trách nhiệm bồi thường hàng hóa sang cho bên giao hàng.\n'
                       '- **Nghiệp vụ chi tiết**:\n'
                       '  - Tập kết các đơn hàng đã đóng gói tại khu vực chờ xuất (Dock xuất) theo từng hãng vận '
                       'chuyển.\n'
                       '  - Bàn giao và quét mã bàn giao cho bưu tá hoặc tài xế giao nhận.\n'
                       '  - Yêu cầu bưu tá ký tên xác nhận vào Biên bản bàn giao xuất kho.\n'
                       '- **⚠️ Lỗi thường gặp**: Để bưu tá tự ý bốc hàng đi mà không ký biên bản bàn giao, cuối ngày '
                       'phát hiện thiếu đơn không có căn cứ bồi thường.\n'
                       '- **💡 Lời khuyên từ Tùng**: Giữ lại liên biên bản giao nhận có chữ ký tươi của bưu tá để làm '
                       'chứng từ gốc đối soát chéo cuối ngày nhé.'},
 'damaged-goods': {1: '**Bước 1: Chụp ảnh bằng chứng & Cô lập hàng lỗi**\n'
                      '\n'
                      '- **Mục tiêu**: Tạo bằng chứng xác thực tình trạng lỗi và ngăn chặn hàng lỗi trộn lẫn với hàng '
                      'tốt.\n'
                      '- **Nghiệp vụ chi tiết**:\n'
                      '  - Dùng điện thoại chụp rõ nét tình trạng hư hỏng dưới ánh sáng tốt: cận cảnh lỗi hỏng, toàn '
                      'cảnh thùng hàng bị ảnh hưởng, và ảnh tem nhãn chứa mã vạch/mã SKU.\n'
                      '  - Tách riêng kiện hàng lỗi ra góc khu vực cách ly biệt trữ hàng lỗi tạm thời.\n'
                      '- **⚠️ Lỗi thường gặp**: Chụp ảnh mờ, tối hoặc không thấy rõ mã vạch sản phẩm khiến nhà cung '
                      'cấp từ chối bồi thường.\n'
                      "- **💡 Lời khuyên từ Tùng**: Hãy dán một tờ giấy ghi 'HÀNG CHỜ XỬ LÝ' lên kiện hàng để mọi người "
                      'biết không lấy nhầm.',
                   2: '**Bước 2: Lập biên bản đồng kiểm hàng lỗi**\n'
                      '\n'
                      '- **Mục tiêu**: Xác lập biên bản pháp lý đồng xác nhận lỗi giữa các bên liên quan.\n'
                      '- **Nghiệp vụ chi tiết**:\n'
                      '  - Điền đầy đủ thông tin vào Biên bản đồng kiểm: mã PO, tên nhà cung cấp, mã SKU, số lượng lỗi '
                      'và mô tả chi tiết tình trạng hỏng.\n'
                      '  - Yêu cầu tài xế giao hàng cùng ký tên xác nhận và viết rõ họ tên.\n'
                      '- **⚠️ Lỗi thường gặp**: Chỉ lập biên bản giấy mà không có chữ ký của tài xế giao hàng, khiến '
                      'biên bản mất giá trị pháp lý bồi thường.\n'
                      '- **💡 Lời khuyên từ Tùng**: Tài xế giao hàng ký tên là cơ sở pháp lý quan trọng nhất để công ty '
                      'mình đòi đền bù từ đối tác.',
                   3: '**Bước 3: Báo cáo sự cố lên phần mềm WMS & Chuyển khu biệt trữ**\n'
                      '\n'
                      '- **Mục tiêu**: Đồng bộ hóa dữ liệu tồn kho thực tế và chuyển hàng lỗi về nơi bảo quản biệt '
                      'lập.\n'
                      '- **Nghiệp vụ chi tiết**:\n'
                      '  - Đăng nhập phần mềm WMS, chọn menu báo cáo hàng lỗi. Nhập mã PO, SKU, số lượng hỏng và tải '
                      'các bức ảnh đã chụp lên.\n'
                      '  - Di chuyển kiện hàng lỗi về khu vực cách ly biệt trữ hàng lỗi (Quarantine Area) ở cuối kho '
                      'có vạch sơn vàng đen.\n'
                      '- **⚠️ Lỗi thường gặp**: Chỉ làm biên bản giấy mà quên cập nhật phần mềm khiến hệ thống vẫn ghi '
                      'nhận tồn kho tốt ảo.\n'
                      '- **💡 Lời khuyên từ Tùng**: Tạo thói quen cập nhật hệ thống WMS ngay sau khi di chuyển hàng lỗi '
                      'về khu biệt trữ để tránh bị quên.'},
 'fragile-packaging': {1: '**Bước 1: Chuẩn bị vật tư đóng gói chống sốc**\n'
                          '\n'
                          '- **Mục tiêu**: Lựa chọn vật liệu giảm chấn phù hợp bảo vệ hàng nhạy cảm.\n'
                          '- **Nghiệp vụ chi tiết**:\n'
                          '  - Chuẩn bị xốp khí bubble wrap, cuộn băng keo bản lớn, giấy chèn lót, kéo.\n'
                          '  - Chọn thùng carton cứng loại 3 lớp hoặc 5 lớp mới, rộng hơn sản phẩm tối thiểu 5-10cm ở '
                          'các chiều.\n'
                          '- **⚠️ Lỗi thường gặp**: Tiết kiệm dùng thùng carton cũ bị mềm góc hoặc thùng quá bé không '
                          'đủ không gian chèn xốp.\n'
                          '- **💡 Lời khuyên từ Tùng**: Không bao giờ bọc hàng dễ vỡ bằng thùng carton vừa khít sản '
                          'phẩm vì khi va đập lực sẽ truyền trực tiếp làm vỡ hàng.',
                       2: '**Bước 2: Bọc chống sốc bằng xốp bong bóng khí (Bubble wrap)**\n'
                          '\n'
                          '- **Mục tiêu**: Tạo lớp đệm không khí bảo vệ trực tiếp quanh sản phẩm.\n'
                          '- **Nghiệp vụ chi tiết**:\n'
                          '  - Quấn xốp khí bong bóng xung quanh sản phẩm tối thiểu 3 vòng (độ dày lớp xốp đạt ít nhất '
                          '2cm).\n'
                          '  - Các hạt bóng khí phải hướng vào phía trong sản phẩm để ôm khít giảm chấn.\n'
                          '  - Dán băng keo cố định các nếp quấn.\n'
                          '- **⚠️ Lỗi thường gặp**: Quấn quá lỏng hoặc quấn ít lớp khiến sản phẩm bị trượt ra ngoài '
                          'khi di chuyển.\n'
                          '- **💡 Lời khuyên từ Tùng**: Đối với quai ly hoặc các chi tiết nhỏ nhô ra, hãy bọc thêm 1 '
                          'lớp xốp để gia cố nhé.',
                       3: '**Bước 3: Lót đệm đáy và xếp hàng vào thùng carton**\n'
                          '\n'
                          '- **Mục tiêu**: Hạn chế lực va đập từ phía dưới đáy thùng khi đặt mạnh thùng hàng xuống '
                          'đất.\n'
                          '- **Nghiệp vụ chi tiết**:\n'
                          '  - Rải một lớp hạt xốp hoặc giấy vò nát xuống đáy thùng carton, độ dày lớp đệm đáy đạt từ '
                          '3cm đến 5cm.\n'
                          '  - Đặt sản phẩm đứng thẳng vào chính giữa thùng. Không đặt nằm ngang nếu sản phẩm là chai '
                          'lọ chứa chất lỏng.\n'
                          '- **⚠️ Lỗi thường gặp**: Đặt sản phẩm trực tiếp lên đáy thùng mà không lót đệm, chỉ cần đặt '
                          'thùng mạnh tay là sản phẩm nứt vỡ từ phía dưới đáy.\n'
                          '- **💡 Lời khuyên từ Tùng**: Lót đệm đáy là lớp bảo vệ đầu tiên chống lại chấn động của nền '
                          'bê tông kho và bưu cục.',
                       4: '**Bước 4: Chèn lót khoảng trống & Niêm phong dán băng keo**\n'
                          '\n'
                          '- **Mục tiêu**: Lấp đầy các khoảng trống bên trong thùng carton, khóa chặt sản phẩm ở vị '
                          'trí trung tâm.\n'
                          '- **Nghiệp vụ chi tiết**:\n'
                          '  - Nhét chặt hạt xốp hoặc giấy vụn vào toàn bộ các khe trống xung quanh sản phẩm và phía '
                          'trên nắp thùng.\n'
                          '  - Gập nắp thùng carton lại, dán băng keo gia cố chạy dọc nắp thùng và quấn vòng quanh '
                          'thân đáy thùng tạo thành hình chữ thập (+).\n'
                          '- **⚠️ Lỗi thường gặp**: Chèn hờ hững khiến sản phẩm bị xê dịch và đâm mạnh vào thành thùng '
                          'khi bưu cục ném hàng.\n'
                          '- **💡 Lời khuyên từ Tùng**: Dùng lực miết mạnh băng keo vào thùng để keo dính chắc chắn, '
                          'tránh bong tróc khi thời tiết ẩm ướt.',
                       5: '**Bước 5: Kiểm tra tiếng kêu & Dán tem cảnh báo màu đỏ**\n'
                          '\n'
                          '- **Mục tiêu**: Kiểm tra chất lượng đóng gói và cảnh báo bưu tá nhẹ tay.\n'
                          '- **Nghiệp vụ chi tiết**:\n'
                          '  - Nhấc thùng hàng lên lắc mạnh thử: nếu nghe tiếng lọc xọc là phải khui ra chèn thêm '
                          'xốp.\n'
                          "  - Nếu đạt chuẩn, dán ít nhất 2 tem màu đỏ **'HÀNG DỄ VỠ - NHẸ TAY'** nổi bật ở mặt trên "
                          'và mặt hông thùng.\n'
                          '- **⚠️ Lỗi thường gặp**: Không dán tem cảnh báo khiến bưu tá quăng quật mạnh tay trong quá '
                          'trình vận chuyển bưu cục.\n'
                          '- **💡 Lời khuyên từ Tùng**: Lắc mạnh thùng là mẹo đơn giản nhất để kiểm tra chất lượng đóng '
                          'gói trước khi bàn giao.'},
 'barcode-printer': {1: '**Bước 1: Lắp decal giấy và cuộn mực ribbon**\n'
                        '\n'
                        '- **Mục tiêu**: Lắp ráp đúng linh kiện và đúng hướng mực in để tránh cháy đầu in.\n'
                        '- **Nghiệp vụ chi tiết**:\n'
                        '  - Tắt nguồn máy in. Mở nắp máy in mã vạch.\n'
                        '  - Lắp cuộn decal vào trục đỡ kẹp giấy, căn chỉnh lẫy kẹp giấy vừa sát mép decal.\n'
                        '  - Lắp cuộn ribbon mực: cuộn mới ở trục sau, cuộn thu hồi ở trục trước. Luồn mực dưới đầu '
                        'in, dán cố định vào cuộn thu hồi. Mặt mực đen phải úp xuống decal.\n'
                        "  - Ấn đầu in xuống cho đến khi khớp chốt khóa kêu 'cạch'.\n"
                        '- **⚠️ Lỗi thường gặp**: Lắp ngược mặt mực ribbon khiến mực bám vào đầu in gây hỏng đầu in '
                        'nhiệt.\n'
                        '- **💡 Lời khuyên từ Tùng**: Dán thử một miếng băng keo nhỏ lên cuộn mực, mặt nào dính mực đen '
                        'bong ra thì mặt đó phải úp xuống decal nhé.',
                     2: '**Bước 2: Kết nối cáp nguồn, cáp USB & Khởi động máy**\n'
                        '\n'
                        '- **Mục tiêu**: Đảm bảo nguồn điện ổn định và máy tính nhận diện đúng driver máy in.\n'
                        '- **Nghiệp vụ chi tiết**:\n'
                        '  - Cắm cáp nguồn vào ổ điện và cáp USB kết nối trực tiếp với máy tính.\n'
                        "  - Bật công tắc nguồn phía sau máy in (vị trí 'I').\n"
                        '  - Đợi khoảng 10 giây cho đến khi đèn LED trên máy chuyển sang màu **xanh lá cây đứng im**.\n'
                        '- **⚠️ Lỗi thường gặp**: Cáp USB lỏng khiến máy tính không gửi được lệnh in, đèn báo nhấp '
                        'nháy đỏ báo lỗi chưa nhận giấy.\n'
                        '- **💡 Lời khuyên từ Tùng**: Đèn xanh đứng im là máy đã sẵn sàng nhận lệnh. Nếu đèn nháy đỏ, '
                        'hãy nhấn FEED 1 lần để máy cuộn định vị.',
                     3: '**Bước 3: Thiết kế tem nhãn sản phẩm trên phần mềm Bartender**\n'
                        '\n'
                        '- **Mục tiêu**: Tạo định dạng tem chuẩn mã vạch giúp máy PDA quét nhận diện dễ dàng.\n'
                        '- **Nghiệp vụ chi tiết**:\n'
                        '  - Mở phần mềm Bartender trên máy tính.\n'
                        '  - Chọn file mẫu tem (Template) có sẵn tương ứng với khổ giấy decal đang lắp (ví dụ: khổ 3 '
                        'tem 35x22mm).\n'
                        '  - Nhập thông tin: mã SKU sản phẩm, tên sản phẩm và hệ thống sẽ tự động vẽ mã vạch tương '
                        'ứng.\n'
                        '- **⚠️ Lỗi thường gặp**: Nhập sai mã SKU sản phẩm khiến máy in mã vạch in ra tem nhãn sai '
                        'hoàn toàn so với tồn kho.\n'
                        '- **💡 Lời khuyên từ Tùng**: Luôn đối chiếu kỹ mã SKU nhập vào với danh mục sản phẩm của hệ '
                        'thống WMS trước khi in nhãn.',
                     4: '**Bước 4: Thực hiện in thử (Test Print) & Kiểm tra chất lượng tem**\n'
                        '\n'
                        '- **Mục tiêu**: Cân chỉnh căn lề tem in tránh lệch dòng lãng phí decal.\n'
                        '- **Nghiệp vụ chi tiết**:\n'
                        '  - Trên phần mềm Bartender, chọn số lượng in là 1 tem và bấm lệnh in.\n'
                        '  - Kiểm tra xem tem in ra: chữ và mã vạch phải sắc nét màu đen đậm, tem không bị lệch dòng, '
                        'không bị cắt đứt nửa tem.\n'
                        '- **⚠️ Lỗi thường gặp**: In hàng loạt ngay khi chưa in thử, nếu máy bị lệch dòng sẽ làm hỏng '
                        'hàng trăm con tem decal.\n'
                        '- **💡 Lời khuyên từ Tùng**: Đừng bỏ qua bước in thử tem nhé, chỉnh lề tem chuẩn xác rồi mới '
                        'bấm in số lượng lớn.',
                     5: '**Bước 5: Bấm in hàng loạt & Giám sát quá trình in**\n'
                        '\n'
                        '- **Mục tiêu**: Hoàn thành số lượng tem nhãn cần dán cho lô hàng.\n'
                        '- **Nghiệp vụ chi tiết**:\n'
                        '  - Khi tem in test đạt chuẩn, nhập số lượng cần in thực tế và bấm in hàng loạt.\n'
                        '  - Giám sát máy in liên tục để xử lý nếu cuộn decal bị kẹt hoặc cuộn ribbon mực bị đứt giữa '
                        'chừng.\n'
                        '- **⚠️ Lỗi thường gặp**: Bỏ đi nơi khác khi máy đang in hàng loạt, máy kẹt giấy làm hỏng đầu '
                        'in do nhiệt độ đầu in tăng cao mà không có giấy decal đệm.\n'
                        '- **💡 Lời khuyên từ Tùng**: Luôn đứng gần máy in khi in số lượng lớn để kịp thời nhấn nút '
                        'Pause nếu có sự cố kẹt giấy phát sinh.'},
 'safety-rules': {1: '**Bước 1: Mặc trang bị bảo hộ bắt buộc (PPE)**\n'
                     '\n'
                     '- **Mục tiêu**: Bảo vệ cơ thể trước các tác động vật lý nguy hiểm trên sàn kho.\n'
                     '- **Nghiệp vụ chi tiết**:\n'
                     '  - Mặc áo phản quang màu neon nổi bật giúp xe nâng nhìn thấy từ xa ít nhất 15m.\n'
                     '  - Đi giày bảo hộ mũi sắt bảo vệ ngón chân tránh bị Pallet đè hoặc hàng nặng rơi trúng.\n'
                     '  - Đội mũ bảo hiểm cứng khi làm việc tại khu kệ cao tầng.\n'
                     '- **⚠️ Lỗi thường gặp**: Chủ quan nghĩ chỉ vào kho lấy đồ 1 phút nên lười đi giày bảo hộ hoặc '
                     'khoác áo phản quang.\n'
                     "- **💡 Lời khuyên từ Tùng**: Nghiêm túc tuân thủ quy tắc 'Không bảo hộ - Không bước vào kho' để "
                     'tự bảo vệ mình nhé.',
                  2: '**Bước 2: Quy tắc di chuyển (Green path & góc cua điểm mù)**\n'
                     '\n'
                     '- **Mục tiêu**: Tách biệt luồng di chuyển của người đi bộ và xe nâng tránh đâm va.\n'
                     '- **Nghiệp vụ chi tiết**:\n'
                     '  - Chỉ đi bộ bên trong làn đường được sơn vạch kẻ màu vàng hoặc xanh lá cây dành riêng cho '
                     'người đi bộ.\n'
                     '  - Đi đến góc cua 90 độ của dãy kệ hàng, dừng lại 2 giây và nhìn vào gương cầu lồi để quan sát '
                     'xe nâng.\n'
                     '- **⚠️ Lỗi thường gặp**: Đi bộ giữa lối đi chính hoặc đi cua nhanh mà không dừng quan sát điểm '
                     'mù, dễ bị xe nâng va phải.\n'
                     '- **💡 Lời khuyên từ Tùng**: Đi đúng làn đường sơn vẽ giúp tài xế xe nâng dễ đoán hướng di chuyển '
                     'của cậu để né tránh.',
                  3: '**Bước 3: Quy tắc xếp hàng lên kệ an toàn**\n'
                     '\n'
                     '- **Mục tiêu**: Đảm bảo kết cấu kệ hàng vững chắc, tránh đổ sập hệ thống kệ cao tầng.\n'
                     '- **Nghiệp vụ chi tiết**:\n'
                     '  - Luôn xếp hàng theo nguyên lý: **Hàng nặng xếp ở tầng dưới (tầng 1-2), hàng nhẹ xếp ở các '
                     'tầng trên cao**.\n'
                     '  - Đặt pallet cân đối giữa các thanh đỡ của kệ hàng, không xếp hàng lệch nghiêng.\n'
                     '- **⚠️ Lỗi thường gặp**: Xếp hàng nặng lên tầng 3-4 vì ngại hạ hàng, làm cho trọng tâm kệ hàng '
                     'bị lung lay dễ sập.\n'
                     '- **💡 Lời khuyên từ Tùng**: Mép hàng xếp lên kệ phải cách thanh đỡ trên ít nhất 10cm để xe nâng '
                     'có không gian bốc dỡ an toàn.'},
 'inventory-counting': {1: '**Bước 1: Nhận phiếu kiểm kê & Chuẩn bị dụng cụ**\n'
                           '\n'
                           '- **Mục tiêu**: Chuẩn bị đầy đủ thông tin vị trí kiểm kê và dụng cụ ghi chép.\n'
                           '- **Nghiệp vụ chi tiết**:\n'
                           '  - Nhận **Phiếu kiểm kê (Inventory Sheet)** từ quản lý ca trực.\n'
                           '  - Chuẩn bị bảng kẹp hồ sơ, bút bi mực đỏ (để dễ phân biệt số thực đếm) và máy quét PDA.\n'
                           '- **⚠️ Lỗi thường gặp**: Dùng bút mực xanh hoặc đen trùng màu chữ in sẵn trên phiếu làm '
                           'quản lý khó phân biệt số thực tế.\n'
                           '- **💡 Lời khuyên từ Tùng**: Dùng bút đỏ ghi số lượng giúp số liệu thực tế nổi bật, dễ đối '
                           'soát chênh lệch sau này.',
                        2: '**Bước 2: Di chuyển đến dãy kệ phân công & Đếm cuốn chiếu**\n'
                           '\n'
                           '- **Mục tiêu**: Định vị đúng khu vực kiểm kê tránh bỏ sót kệ hàng.\n'
                           '- **Nghiệp vụ chi tiết**:\n'
                           '  - Đi đến đúng dãy kệ được ghi trên Phiếu kiểm kê.\n'
                           '  - Tiến hành đếm theo thứ tự khoa học: **từ kệ trái sang phải, từ tầng trên cùng xuống '
                           'dưới cùng**.\n'
                           '- **⚠️ Lỗi thường gặp**: Đếm nhảy cóc vị trí kệ vì thấy kệ bên kia ít hàng đếm trước, dễ '
                           'gây trùng lặp hoặc bỏ sót hàng.\n'
                           '- **💡 Lời khuyên từ Tùng**: Đếm cuốn chiếu một chiều duy nhất là nguyên tắc vàng giúp '
                           'không bị sót bất kỳ góc khuất nào của kệ.',
                        3: '**Bước 3: Thực hiện kiểm đếm vật lý trực tiếp**\n'
                           '\n'
                           '- **Mục tiêu**: Đảm bảo số lượng đếm được khớp đúng với thực tế sản phẩm vật lý.\n'
                           '- **Nghiệp vụ chi tiết**:\n'
                           '  - Nhấc từng hộp sản phẩm ra khỏi pallet để đếm chi tiết từng món.\n'
                           "  - Ghi số lượng thực đếm được vào cột 'Thực tế' trên phiếu bằng bút mực đỏ.\n"
                           '- **⚠️ Lỗi thường gặp**: Chỉ đếm vỏ hộp carton lớn rồi nhân số lượng nhãn mác dán ngoài '
                           'vỏ, thực tế vỏ hộp có thể trống rỗng.\n'
                           '- **💡 Lời khuyên từ Tùng**: Hãy mở nắp hộp kiểm tra ngẫu nhiên xem bên trong có đủ hàng '
                           'không nhé, tránh đếm nhầm vỏ hộp không.',
                        4: '**Bước 4: Thực hiện đếm chéo lần 2 độc lập**\n'
                           '\n'
                           '- **Mục tiêu**: Loại bỏ lỗi đếm sai do chủ quan cảm tính.\n'
                           '- **Nghiệp vụ chi tiết**:\n'
                           '  - Sau khi đếm xong lần 1, đổi phiếu kiểm kê với đồng nghiệp cùng dãy kệ để họ đếm lại '
                           'lần 2 độc lập.\n'
                           '  - So sánh kết quả 2 lần đếm. Nếu lệch nhau, cả hai cùng đếm lại lần 3 để chốt số chính '
                           'xác nhất.\n'
                           '- **⚠️ Lỗi thường gặp**: Nhìn kết quả đếm lần 1 rồi ghi y hệt vào lần 2 cho nhanh, làm mất '
                           'tác dụng của kiểm chéo.\n'
                           '- **💡 Lời khuyên từ Tùng**: Đếm chéo độc lập là cách tốt nhất để đảm bảo số liệu trung '
                           'thực, tránh sai sót dắt dây.',
                        5: '**Bước 5: Đối soát số liệu thực đếm với hệ thống WMS**\n'
                           '\n'
                           '- **Mục tiêu**: Phát hiện sai lệch số liệu tồn kho ảo hệ thống so với số thực đếm.\n'
                           '- **Nghiệp vụ chi tiết**:\n'
                           '  - Dùng máy PDA quét mã SKU của sản phẩm để xem số lượng tồn kho hiển thị trên phần mềm '
                           'WMS.\n'
                           '  - Khoanh tròn các mã hàng có số liệu thực tế lệch thừa hoặc thiếu so với hệ thống.\n'
                           '- **⚠️ Lỗi thường gặp**: Thấy lệch số liệu, tự ý gõ sửa lại số trên PDA cho bằng khớp để '
                           'hoàn thành ca sớm.\n'
                           '- **💡 Lời khuyên từ Tùng**: Tuyệt đối không tự ý sửa số tồn kho hệ thống PDA khi chưa có '
                           'lệnh duyệt của quản lý kho nhé.',
                        6: '**Bước 6: Lập biên bản chênh lệch & Nộp báo cáo cho quản lý**\n'
                           '\n'
                           '- **Mục tiêu**: Báo cáo sự cố lệch tồn kho để điều chỉnh tài chính và kiểm tra camera.\n'
                           '- **Nghiệp vụ chi tiết**:\n'
                           '  - Lập biên bản ghi rõ mã SKU bị lệch, số lượng lệch và lý do nghi ngờ.\n'
                           '  - Ký tên xác nhận cuối phiếu và nộp lại phiếu cùng biên bản cho Quản lý kho duyệt.\n'
                           '- **⚠️ Lỗi thường gặp**: Gom phiếu để nhiều ngày mới nộp, khiến việc tìm camera truy tìm '
                           'nguyên nhân mất hàng gặp khó khăn.\n'
                           '- **💡 Lời khuyên từ Tùng**: Nộp báo cáo chênh lệch ngay trong ca để quản lý kho kịp rà '
                           'soát camera an ninh tìm nguyên nhân.'},
 'returns-handling': {1: '**Bước 1: Tiếp nhận hàng hoàn từ bưu tá & Quét vận đơn**\n'
                         '\n'
                         '- **Mục tiêu**: Xác thực kiện hàng hoàn trả thuộc đơn mua hàng hợp lệ của kho.\n'
                         '- **Nghiệp vụ chi tiết**:\n'
                         '  - Nhận kiện hàng hoàn trả từ bưu tá của các đơn vị vận chuyển giao tới.\n'
                         '  - Dùng máy PDA quét **Mã vận đơn (Tracking ID)** dán bên ngoài hộp để đối chiếu đơn gốc '
                         'trên hệ thống WMS.\n'
                         '- **⚠️ Lỗi thường gặp**: Nhận bừa các kiện hoàn không rõ nguồn gốc hoặc không có thông tin '
                         'trên hệ thống, gây khó khăn cho đối soát chênh lệch.\n'
                         '- **💡 Lời khuyên từ Tùng**: Nếu không quét được mã vận đơn, hãy để riêng kiện đó ra khu vực '
                         'hàng chờ xử lý và báo quản lý ca nhé.',
                      2: '**Bước 2: Khui mở hộp & Quay video/Chụp ảnh hiện trạng**\n'
                         '\n'
                         '- **Mục tiêu**: Lưu lại bằng chứng trạng thái sản phẩm lúc khui mở tránh tranh chấp.\n'
                         '- **Nghiệp vụ chi tiết**:\n'
                         '  - Dùng dao rọc giấy khui kiện hàng nhẹ tay.\n'
                         '  - Sử dụng điện thoại quay video hoặc chụp ảnh hiện trạng bên trong thùng hàng ngay khi vừa '
                         'mở nắp.\n'
                         '- **⚠️ Lỗi thường gặp**: Khui hàng vội vã làm hỏng sản phẩm bên trong hoặc khui không quay '
                         'phim, không có bằng chứng đối soát với bưu điện.\n'
                         '- **💡 Lời khuyên từ Tùng**: Video mở hộp là bằng chứng thép giúp công ty từ chối hoàn tiền '
                         'nếu phát hiện khách hàng gửi trả hộp rỗng hoặc tráo hàng cũ.',
                      3: '**Bước 3: Đánh giá chất lượng & Phụ kiện chi tiết**\n'
                         '\n'
                         '- **Mục tiêu**: Đánh giá chính xác hư hại vật lý và phụ kiện kèm theo.\n'
                         '- **Nghiệp vụ chi tiết**:\n'
                         '  - So sánh số serial/mã IMEI trên sản phẩm hoàn với thông tin đơn hàng gốc xem có đúng sản '
                         'phẩm của kho gửi đi không.\n'
                         '  - Kiểm tra xem phụ kiện đi kèm, quà tặng, sách hướng dẫn có đầy đủ không, vỏ hộp có móp '
                         'rách không.\n'
                         '- **⚠️ Lỗi thường gặp**: Khách hàng tráo sản phẩm cũ nát hoặc sản phẩm nhái thương hiệu gửi '
                         'trả về mà không phát hiện ra.\n'
                         '- **💡 Lời khuyên từ Tùng**: Luôn đối chiếu kỹ tem nhãn và số serial sản phẩm để tránh bị '
                         'khách hàng hoặc bên vận chuyển lừa đảo tráo hàng.',
                      4: '**Bước 4: Phân loại hàng hoàn (Grading Loại A/B/C)**\n'
                         '\n'
                         '- **Mục tiêu**: Định tuyến trạng thái sản phẩm để xử lý bán lại hoặc thanh lý.\n'
                         '- **Nghiệp vụ chi tiết**:\n'
                         '  - Chia hàng hoàn trả thành 3 loại rõ ràng:\n'
                         '    - **Loại A (Mới 100%, nguyên tem)**: Đủ điều kiện nhập kho tốt bán tiếp.\n'
                         '    - **Loại B (Hộp rách, trầy xước nhẹ)**: Đưa sang khu kệ thanh lý xả hàng giảm giá.\n'
                         '    - **Loại C (Hỏng nặng, bể vỡ, bị tráo đổi)**: Đưa về khu biệt trữ chờ bồi thường hoặc '
                         'tiêu hủy.\n'
                         '- **⚠️ Lỗi thường gặp**: Nhập nhầm hàng Loại B/C vào kho hàng tốt, sau đó lại đóng gói gửi '
                         'nhầm cho khách tiếp theo gây khiếu nại.\n'
                         '- **💡 Lời khuyên từ Tùng**: Phân loại chuẩn xác giúp bảo vệ uy tín thương hiệu và giảm thiểu '
                         'rủi ro khi khiếu nại.',
                      5: '**Bước 5: Cập nhật thông tin lên phần mềm WMS**\n'
                         '\n'
                         '- **Mục tiêu**: Cập nhật dữ liệu tồn kho theo đúng phân loại chất lượng thực tế.\n'
                         '- **Nghiệp vụ chi tiết**:\n'
                         "  - Mở phần mềm WMS trên máy tính hoặc PDA, vào menu 'Hàng hoàn trả'.\n"
                         '  - Chọn đơn hàng tương ứng, chọn phân loại hàng hoàn (A, B hoặc C) và bấm xác nhận nhập lại '
                         'hệ thống.\n'
                         '- **⚠️ Lỗi thường gặp**: Chỉ xếp hàng lên kệ mà quên quét PDA xác nhận nhập hoàn, làm hệ '
                         'thống báo lệch số liệu tồn kho.\n'
                         '- **💡 Lời khuyên từ Tùng**: Thực hiện cập nhật phần mềm ngay sau khi phân loại để hệ thống '
                         'kịp thời cập nhật dữ liệu tồn kho.',
                      6: '**Bước 6: Sắp xếp hàng hóa về kệ lưu trữ tương ứng**\n'
                         '\n'
                         '- **Mục tiêu**: Trả sản phẩm về đúng vị trí kệ quy định phục vụ cho đơn hàng tiếp theo.\n'
                         '- **Nghiệp vụ chi tiết**:\n'
                         '  - Với hàng Loại A, đưa về đúng vị trí kệ cũ và quét mã vạch vị trí kệ để cộng tồn kho.\n'
                         '  - Với hàng Loại B và C, di chuyển về các khu kệ cách ly biệt trữ tương ứng.\n'
                         '- **⚠️ Lỗi thường gặp**: Xếp lẫn lộn hàng loại B/C vào kệ loại A làm cản trở nhân viên đi '
                         'nhặt hàng mới.\n'
                         '- **💡 Lời khuyên từ Tùng**: Nhớ dán decal trạng thái màu sắc lên sản phẩm Loại B/C để người '
                         'khác nhìn biết ngay không bốc nhầm đơn.'},
 'fifo-fefo': {1: '**Bước 1: Xác định nguyên tắc (FIFO hay FEFO) cho từng loại hàng**\n'
                  '\n'
                  '- **Mục tiêu**: Áp dụng đúng nguyên tắc xoay vòng kho cho từng loại sản phẩm tránh hết date.\n'
                  '- **Nghiệp vụ chi tiết**:\n'
                  '  - Kiểm tra thuộc tính hàng hóa khi nhập kho:\n'
                  '    - **FEFO (Hết hạn trước - Xuất trước)**: Áp dụng cho hàng có hạn sử dụng (sữa, thực phẩm, mỹ '
                  'phẩm, dược phẩm).\n'
                  '    - **FIFO (Nhập trước - Xuất trước)**: Áp dụng cho hàng không có hạn sử dụng (thiết bị điện tử, '
                  'quần áo, gia dụng, sách).\n'
                  '- **⚠️ Lỗi thường gặp**: Áp dụng lộn xộn nguyên tắc khiến hàng thực phẩm cận date nằm góc kệ sâu và '
                  'bị hết hạn phải tiêu hủy.\n'
                  '- **💡 Lời khuyên từ Tùng**: Xác định đúng nguyên tắc ngay từ khâu tiếp nhận hàng ở bến nhập để dán '
                  'nhãn phân loại chuẩn nhé.',
               2: '**Bước 2: Kiểm tra date (HSD) hoặc ngày nhập kho**\n'
                  '\n'
                  '- **Mục tiêu**: So sánh hạn sử dụng lô hàng mới nhập với lô hàng cũ đang lưu trữ.\n'
                  '- **Nghiệp vụ chi tiết**:\n'
                  '  - Đọc kỹ hạn sử dụng (Expiry Date) hoặc ngày sản xuất in trên tem nhãn của lô hàng mới nhập.\n'
                  '  - So sánh trực tiếp với date của lô hàng cũ đang có trên kệ lưu trữ.\n'
                  '- **⚠️ Lỗi thường gặp**: Bỏ qua date của hàng mới nhập, mặc định hàng mới nhập có date dài hơn hàng '
                  'cũ (thực tế hàng xả kho có thể date rất ngắn).\n'
                  '- **💡 Lời khuyên từ Tùng**: Nếu lô mới nhập có date ngắn hơn lô cũ trên kệ, bắt buộc phải ưu tiên '
                  'xếp lô mới này ở mép ngoài để xuất trước (FEFO).',
               3: '**Bước 3: Sắp xếp xoay vòng kệ hàng (Stock Rotation)**\n'
                  '\n'
                  '- **Mục tiêu**: Đưa hàng cần xuất trước ra vị trí thuận tiện nhất.\n'
                  '- **Nghiệp vụ chi tiết**:\n'
                  '  - Rút toàn bộ các hộp sản phẩm cũ đang nằm sẵn trên kệ ra phía sát mép ngoài cùng.\n'
                  '  - Đưa các hộp sản phẩm mới nhập về xếp vào vị trí phía trong cùng của kệ hàng.\n'
                  '  - Đảm bảo mặt nhãn ghi hạn sử dụng quay ra phía ngoài để dễ đọc.\n'
                  '- **⚠️ Lỗi thường gặp**: Xếp đè hàng mới lên hàng cũ chặn ở rìa ngoài kệ, làm hàng cũ bên trong bị '
                  'kẹt lưu kho quá hạn.\n'
                  "- **💡 Lời khuyên từ Tùng**: Hãy luôn ghi nhớ câu thần chú: 'Cũ ở ngoài - Mới ở trong' mỗi khi đặt "
                  'bất cứ kiện hàng nào lên kệ nhé.',
               4: '**Bước 4: Dán nhãn tem theo dõi FEFO (Cận date)**\n'
                  '\n'
                  '- **Mục tiêu**: Tạo cảnh báo trực quan cho nhân viên nhặt hàng bốc nhanh lô cận date.\n'
                  '- **Nghiệp vụ chi tiết**:\n'
                  '  - Với các lô hàng sắp đến cận hạn sử dụng (dưới 3 tháng), dán một miếng tem tròn màu đỏ nổi bật '
                  "ghi chữ **'FEFO'** ngoài vỏ pallet.\n"
                  '- **⚠️ Lỗi thường gặp**: Không dán nhãn cảnh báo khiến nhân viên đi nhặt hàng mất thời gian nhấc '
                  'từng hộp lên xem date.\n'
                  '- **💡 Lời khuyên từ Tùng**: Mẹo dán nhãn đỏ này giúp nhân viên nhặt hàng nhìn thấy là ưu tiên bốc '
                  'đi trước, giảm thiểu tỷ lệ hàng hết date hủy bỏ.',
               5: '**Bước 5: Thực hiện nhặt hàng xuất kho đúng quy chuẩn**\n'
                  '\n'
                  '- **Mục tiêu**: Xuất đúng lô hàng cần xuất theo quy định FIFO/FEFO.\n'
                  '- **Nghiệp vụ chi tiết**:\n'
                  '  - Khi đi nhặt hàng, nhân viên pick hàng bắt buộc phải lấy sản phẩm xếp ở hàng ngoài cùng trước.\n'
                  '  - Tuyệt đối không được lấy các hộp mới xếp ở sâu phía trong kệ.\n'
                  '- **⚠️ Lỗi thường gặp**: Lấy lách các thùng mới bên trong vì hộp ngoài cùng hơi bám bụi, vi phạm '
                  'nguyên tắc xoay vòng kho.\n'
                  '- **💡 Lời khuyên từ Tùng**: Luôn tự giác tuân thủ nguyên tắc lấy hàng ở ngoài cùng trước để bảo vệ '
                  'chất lượng chung của tồn kho.'},
 'fire-emergency': {1: '**Bước 1: Báo động khẩn cấp (Nhấn chuông báo cháy đỏ)**\n'
                       '\n'
                       '- **Mục tiêu**: Báo động khẩn cấp cho toàn bộ nhân viên trong kho biết để sơ tán kịp thời.\n'
                       '- **Nghiệp vụ chi tiết**:\n'
                       '  - Ngay khi phát hiện khói, mùi khét hoặc lửa bùng phát, chạy nhanh đến **Nút báo cháy khẩn '
                       'cấp** màu đỏ trên tường.\n'
                       '  - Đập mạnh tay vào tấm kính giữa hộp để kích hoạt chuông báo cháy réo vang toàn kho.\n'
                       "  - Hét lớn: **'CHÁY! CHÁY! MỌI NGƯỜI SƠ TÁN NGAY!'**.\n"
                       '- **⚠️ Lỗi thường gặp**: Cố tự dập lửa một mình khi lửa đã bùng to mà không báo động cho người '
                       'khác biết, gây nguy hiểm cho toàn kho.\n'
                       '- **💡 Lời khuyên từ Tùng**: Đừng ngần ngại bấm chuông báo cháy ngay cả khi chỉ thấy khói nghi '
                       'ngờ, tính mạng luôn là trên hết.',
                    2: '**Bước 2: Gọi điện thoại báo lực lượng cứu hỏa 114**\n'
                       '\n'
                       '- **Mục tiêu**: Gọi lực lượng cứu hỏa chuyên nghiệp ứng cứu dập lửa.\n'
                       '- **Nghiệp vụ chi tiết**:\n'
                       '  - Dùng điện thoại di động gọi ngay số **114**.\n'
                       '  - Cung cấp rõ ràng: Địa chỉ chính xác của kho hàng, mô tả sơ bộ đám cháy và báo xem có ai bị '
                       'kẹt bên trong hay không.\n'
                       '- **⚠️ Lỗi thường gặp**: Gọi điện thoại báo cháy muộn hoặc hoảng loạn không nói rõ địa chỉ kho '
                       'khiến đội cứu hỏa đi nhầm đường.\n'
                       '- **💡 Lời khuyên từ Tùng**: Hãy nói to, rõ ràng và bình tĩnh cung cấp tên kho cùng tuyến đường '
                       'chính để đội cứu hỏa tiếp cận nhanh nhất.',
                    3: '**Bước 3: Ngắt nguồn điện tổng của khu vực kho (Aptomat)**\n'
                       '\n'
                       '- **Mục tiêu**: Triệt tiêu nguy cơ chập cháy điện lan rộng và nguy cơ điện giật cho người sơ '
                       'tán.\n'
                       '- **Nghiệp vụ chi tiết**:\n'
                       '  - Nếu bảng điện tổng (Aptomat) nằm ở khu vực an toàn và cậu đứng gần đó, hãy gạt Aptomat '
                       'ngắt điện toàn kho.\n'
                       '- **⚠️ Lỗi thường gặp**: Cố ngắt điện khi lửa đã bao vây tủ điện, nguy cơ gây giật điện hoặc '
                       'cháy bỏng nặng.\n'
                       '- **💡 Lời khuyên từ Tùng**: Chỉ ngắt điện khi tủ điện ở khu vực an toàn và cậu tự tin thao '
                       'tác. Tuyệt đối không tiếp xúc nếu tay đang ướt.',
                    4: '**Bước 4: Sơ tán người ra khỏi kho theo lối EXIT (Khom lưng tránh khói)**\n'
                       '\n'
                       '- **Mục tiêu**: Đưa bản thân và đồng nghiệp thoát ra ngoài an toàn nhanh nhất.\n'
                       '- **Nghiệp vụ chi tiết**:\n'
                       '  - Bỏ lại toàn bộ hàng hóa và tư trang cá nhân làm chậm tốc độ sơ tán.\n'
                       '  - Di chuyển theo hướng biển chỉ dẫn **EXIT** màu xanh lá phát sáng.\n'
                       '  - Nếu có khói độc, đi khom lưng sát mặt đất và dùng khăn/áo thấm nước che kín mũi miệng.\n'
                       '- **⚠️ Lỗi thường gặp**: Cố chạy đi lấy ví tiền, điện thoại hoặc hàng hóa giá trị cao làm lỡ '
                       'thời gian vàng thoát hiểm.\n'
                       '- **💡 Lời khuyên từ Tùng**: Khói nóng chứa khí CO cực kỳ nguy hiểm, đi khom lưng giúp cậu '
                       'tránh hít phải khí độc tích tụ ở tầng cao của kho.',
                    5: '**Bước 5: Tập trung điểm danh nhân số tại cổng chính an toàn**\n'
                       '\n'
                       '- **Mục tiêu**: Xác nhận toàn bộ nhân sự đã thoát ra ngoài an toàn, hỗ trợ cứu hộ người bị '
                       'kẹt.\n'
                       '- **Nghiệp vụ chi tiết**:\n'
                       '  - Di chuyển ra bãi đất trống phía trước cổng chính của kho (vùng tập trung an toàn).\n'
                       '  - Đứng theo hàng để quản lý ca trực tiến hành điểm danh nhanh theo danh sách chấm công '
                       'ngày.\n'
                       '- **⚠️ Lỗi thường gặp**: Tự ý chạy về nhà hoặc bỏ đi nơi khác khi chưa điểm danh, khiến ban '
                       'quản lý tưởng cậu còn kẹt trong kho và cho lính cứu hỏa vào tìm.\n'
                       '- **💡 Lời khuyên từ Tùng**: Nghiêm túc đứng tại điểm tập trung cho đến khi quản lý ca xác nhận '
                       'cậu an toàn nhé.',
                    6: '**Bước 6: Chữa cháy ban đầu bằng bình chữa cháy (nếu đám cháy nhỏ)**\n'
                       '\n'
                       '- **Mục tiêu**: Dập tắt đám cháy ngay từ khi mới bùng phát giảm thiểu thiệt hại.\n'
                       '- **Nghiệp vụ chi tiết**:\n'
                       '  - Chỉ thực hiện nếu đám cháy diện tích dưới 1 mét vuông và cậu biết dùng bình chữa cháy.\n'
                       '  - Nguyên tắc **PASS**: Giật chốt an toàn (Pull), Hướng vòi vào gốc lửa (Aim), Bóp mạnh tay '
                       'cầm (Squeeze), Quét vòi qua lại (Sweep).\n'
                       '- **⚠️ Lỗi thường gặp**: Phun bình khí CO2 trực tiếp vào người khác gây bỏng lạnh cực kỳ nguy '
                       'hiểm.\n'
                       '- **💡 Lời khuyên từ Tùng**: Dùng bình chữa cháy thì chĩa vòi vào gốc ngọn lửa (nơi phát sinh '
                       'lửa), không chĩa vào ngọn lửa bốc cao nha.'},
 'shift-handover': {1: '**Bước 1: Dọn dẹp vệ sinh khu vực làm việc ca trực**\n'
                       '\n'
                       '- **Mục tiêu**: Trả lại khu vực làm việc sạch sẽ gọn gàng sẵn sàng cho ca trực tiếp theo.\n'
                       '- **Nghiệp vụ chi tiết**:\n'
                       '  - Trước khi hết ca trực 20 phút, dọn dẹp bàn đóng gói/bến nhập hàng.\n'
                       '  - Quét dọn các mảnh vụn giấy carton, cuộn băng keo thừa vứt vào thùng rác.\n'
                       '  - Trả máy quét PDA, bút bi, kéo, dao rọc giấy về đúng kệ dụng cụ quy định.\n'
                       '- **⚠️ Lỗi thường gặp**: Để bàn làm việc lộn xộn bám bụi, ca sau vào việc phải mất 15 phút dọn '
                       'dẹp làm chậm trễ tiến độ đóng đơn.\n'
                       '- **💡 Lời khuyên từ Tùng**: Khu vực làm việc ngăn nắp thể hiện sự tôn trọng đồng nghiệp ca sau '
                       'và giúp họ vào việc được ngay.',
                    2: '**Bước 2: Kiểm tra tiến độ các đơn hàng dở dang**\n'
                       '\n'
                       '- **Mục tiêu**: Xác định rõ khối lượng đơn hàng cần bàn giao để ca sau tiếp quản liên tục.\n'
                       '- **Nghiệp vụ chi tiết**:\n'
                       '  - Đăng nhập phần mềm quản lý kho WMS, kiểm tra danh sách đơn đã hoàn thành.\n'
                       '  - Xác định các mã đơn hàng đang xử lý dở dang (ví dụ: đang pick dở, chờ đóng gói) để ca sau '
                       'biết làm tiếp.\n'
                       '- **⚠️ Lỗi thường gặp**: Quên không báo đơn hàng khẩn đang làm dở, khiến đơn hàng bị ngâm trễ '
                       'giờ giao cho nhà xe.\n'
                       '- **💡 Lời khuyên từ Tùng**: Chú ý liệt kê rõ các đơn hàng khẩn cấp (Express) cần ưu tiên xử lý '
                       'trước để ca sau nắm được.',
                    3: '**Bước 3: Rà soát khu vực hàng chờ xử lý (hàng lỗi, hàng hoàn)**\n'
                       '\n'
                       '- **Mục tiêu**: Bàn giao chính xác tình trạng hàng lỗi và hàng trả về chưa xử lý.\n'
                       '- **Nghiệp vụ chi tiết**:\n'
                       '  - Đi qua khu vực cách ly biệt trữ hàng lỗi (Quarantine) và bàn kiểm hàng hoàn trả.\n'
                       '  - Ghi nhận xem còn kiện hàng nào chưa lập biên bản hay chưa cập nhật hệ thống WMS không.\n'
                       '- **⚠️ Lỗi thường gặp**: Bỏ quên kiện hàng lỗi ở bến nhập không bàn giao, ca sau tưởng hàng '
                       'tốt đem cất lên kệ thường.\n'
                       '- **💡 Lời khuyên từ Tùng**: Ghi rõ mã kiện hàng lỗi dở dang vào sổ bàn giao để tránh lẫn lộn '
                       'hàng tốt hàng hỏng nhé.',
                    4: '**Bước 4: Ghi sổ bàn giao ca (Shift Log)**\n'
                       '\n'
                       '- **Mục tiêu**: Ghi nhận bằng văn bản chi tiết toàn bộ trạng thái kho cuối ca trực.\n'
                       '- **Nghiệp vụ chi tiết**:\n'
                       '  - Ghi chép chi tiết vào sổ bàn giao ca:\n'
                       '    - Số lượng đơn đã hoàn thành trong ca.\n'
                       '    - Mã số các đơn hàng đang xử lý dở dang.\n'
                       '    - Tình trạng thiết bị kho gặp sự cố (máy in kẹt, xe nâng điện yếu).\n'
                       '    - Các ghi chú lưu ý đặc biệt từ ban quản lý kho.\n'
                       '- **⚠️ Lỗi thường gặp**: Ghi sổ qua loa đại khái viết chữ quá ngoáy, ca sau vào không đọc được '
                       'thông tin sự cố.\n'
                       '- **💡 Lời khuyên từ Tùng**: Ghi chép rõ ràng, chữ viết dễ đọc để tránh ca sau hiểu lầm thông '
                       'tin.',
                    5: '**Bước 5: Trao đổi miệng & Chỉ dẫn trực quan cho ca sau**\n'
                       '\n'
                       '- **Mục tiêu**: Truyền đạt trực quan các điểm nóng và lưu ý quan trọng cho ca sau.\n'
                       '- **Nghiệp vụ chi tiết**:\n'
                       '  - Khi người nhận ca đến, mở sổ bàn giao giải thích trực tiếp qua miệng.\n'
                       '  - Dẫn đồng nghiệp ca sau đi một vòng quanh bàn đóng gói hoặc bến nhập xuất chỉ rõ vị trí các '
                       'đơn dở dang.\n'
                       '- **⚠️ Lỗi thường gặp**: Chỉ bàn giao miệng qua điện thoại hoặc gửi tin nhắn ngắn ngủi, người '
                       'ca sau không hình dung được thực tế.\n'
                       '- **💡 Lời khuyên từ Tùng**: Trao đổi miệng và chỉ tay trực quan là cách tốt nhất để triệt tiêu '
                       'hiểu lầm giữa 2 ca trực.',
                    6: '**Bước 6: Cả hai bên ký tên xác nhận bàn giao ca trực**\n'
                       '\n'
                       '- **Mục tiêu**: Ký cam kết chịu trách nhiệm pháp lý thời điểm chuyển giao ca trực.\n'
                       '- **Nghiệp vụ chi tiết**:\n'
                       '  - Người giao (cậu) và người nhận cùng ký tên xác nhận vào sổ bàn giao ca.\n'
                       '  - Ghi rõ thời điểm ký nhận ca (giờ, phút).\n'
                       '- **⚠️ Lỗi thường gặp**: Quên ký sổ bàn giao ca, khi xảy ra mất mát tài sản trong ca sau không '
                       'phân định được lỗi do ai.\n'
                       '- **💡 Lời khuyên từ Tùng**: Chữ ký xác nhận bàn giao ca bảo vệ chính cậu khỏi các tranh chấp '
                       'quy trách nhiệm sau này.'},
 'forklift-operation': {1: '**Bước 1: Kiểm tra chứng chỉ & Phân công nhiệm vụ lái xe nâng**\n'
                           '\n'
                           '- **Mục tiêu**: Đảm bảo người vận hành có đủ năng lực pháp lý và kỹ thuật vận hành thiết '
                           'bị nặng.\n'
                           '- **Nghiệp vụ chi tiết**:\n'
                           '  - Bắt buộc phải có **Chứng chỉ vận hành xe nâng** hợp lệ do cơ quan chức năng cấp.\n'
                           '  - Được sự phân công trực tiếp bằng văn bản hoặc lời nói từ Quản lý kho ca trực.\n'
                           '- **⚠️ Lỗi thường gặp**: Tự ý leo lên lái thử xe nâng khi chưa được đào tạo lái hoặc mượn '
                           'chìa khóa chạy nghịch phá.\n'
                           '- **💡 Lời khuyên từ Tùng**: Xe nâng là thiết bị gây ra các vụ tai nạn lật kệ nghiêm trọng '
                           'nhất, tuyệt đối không tự ý lái nếu chưa có chứng chỉ nhé.',
                        2: '**Bước 2: Kiểm tra an toàn kỹ thuật xe nâng trước khi dùng (Pre-check)**\n'
                           '\n'
                           '- **Mục tiêu**: Phát hiện sớm các lỗi kỹ thuật nguy hiểm trước khi cho xe nâng lăn bánh.\n'
                           '- **Nghiệp vụ chi tiết**:\n'
                           '  - Kiểm tra ngoại quan xe nâng: lốp, xích nâng, mức dầu thủy lực, rò rỉ dầu gầm xe.\n'
                           '  - Ngồi vào cabin, thắt dây an toàn, nổ máy thử còi báo, phanh chân, phanh tay xem có '
                           'nhạy không.\n'
                           '- **⚠️ Lỗi thường gặp**: Bỏ qua bước kiểm tra phanh xe, khi chở pallet hàng nặng 1 tấn '
                           'phanh không ăn gây đâm lật kệ.\n'
                           '- **💡 Lời khuyên từ Tùng**: Nếu phát hiện xe nâng bị rò rỉ dầu thủy lực hoặc phanh không '
                           "ăn, tắt máy, treo biển 'HỎNG - CẤM DÙNG' và báo kỹ thuật ngay.",
                        3: '**Bước 3: Quy định di chuyển an toàn trong kho (Tốc độ & Còi góc cua)**\n'
                           '\n'
                           '- **Mục tiêu**: Hạn chế va chạm với người đi bộ và va quệt kệ hàng.\n'
                           '- **Nghiệp vụ chi tiết**:\n'
                           '  - Tốc độ tối đa cho phép trong kho là **10 km/h** (5 km/h ở ngã rẽ).\n'
                           '  - Luôn bóp còi ngắt quãng khi đi qua lối rẽ, góc khuất kệ hoặc rèm nhựa ngăn.\n'
                           '  - Khi di chuyển, hạ càng nâng sát mặt đất cách sàn từ **15cm đến 20cm**.\n'
                           '- **⚠️ Tại sao không được chạy quá 10km/h và hậu quả**:\n'
                           '  - Xe nâng nặng 3-5 tấn có quán tính rất lớn; chạy quá 10km/h làm quãng đường phanh quá '
                           'dài, không thể dừng kịp khi gặp người đi bộ ở góc cua.\n'
                           '  - Phanh gấp khi chạy nhanh làm hàng hóa đổ sập phía trước hoặc đâm vào cabin lái.\n'
                           '  - Tốc độ cao khi ôm cua với trọng tâm xe nâng cao sẽ gây lực ly tâm lớn làm lật xe hoặc '
                           'đâm sập hệ thống kệ hàng khung sắt.\n'
                           '- **💡 Lời khuyên từ Tùng**: Luôn tự giác tuân thủ giới hạn tốc độ 10km/h vì an toàn của '
                           'chính bản thân cậu và mọi người xung quanh.',
                        4: '**Bước 4: Thao tác nâng hàng từ kệ xuống sàn (Picking)**\n'
                           '\n'
                           '- **Mục tiêu**: Tiếp cận và bốc pallet hàng từ kệ cao xuống sàn an toàn.\n'
                           '- **Nghiệp vụ chi tiết**:\n'
                           '  - Tiến xe nâng vuông góc với kệ hàng. Đưa càng nâng vào tâm pallet thật chậm rãi.\n'
                           '  - Nâng pallet lên cách mặt kệ khoảng 5cm.\n'
                           '  - Nghiêng khung nâng về phía sau (cabin lái) khoảng 5-10 độ để hàng tựa chắc vào giá '
                           'đỡ.\n'
                           '  - Lùi xe ra khỏi kệ và hạ hàng xuống độ cao di chuyển (15-20cm cách sàn).\n'
                           '- **⚠️ Lỗi thường gặp**: Nâng pallet lên cao rồi lùi xe nhanh khi chưa nghiêng khung nâng '
                           'làm pallet trượt rơi tự do xuống đất.\n'
                           '- **💡 Lời khuyên từ Tùng**: Thao tác nâng hàng ở kệ cao yêu cầu sự tỉ mỉ, không được vội '
                           'vàng. Hãy nhìn kỹ vị trí càng nâng trước khi bóp ga lùi xe.',
                        5: '**Bước 5: Thao tác xếp hàng lên kệ cao tầng (Putting)**\n'
                           '\n'
                           '- **Mục tiêu**: Xếp pallet hàng lên kệ cao tầng cân đối không gây lật kệ.\n'
                           '- **Nghiệp vụ chi tiết**:\n'
                           '  - Tiến xe chứa hàng đến trước vị trí kệ cần xếp.\n'
                           '  - Nâng pallet lên cao hơn thanh đỡ của kệ khoảng 10cm.\n'
                           '  - Tiến xe từ từ cho pallet nằm cân đối phía trên thanh đỡ kệ. Trả khung nâng về vị trí '
                           'thẳng đứng.\n'
                           '  - Hạ càng nâng xuống để pallet đặt hẳn lên kệ và lùi xe nâng ra chậm rãi.\n'
                           '- **⚠️ Lỗi thường gặp**: Hạ càng nâng khi pallet chưa nằm cân đối trên hai thanh sắt đỡ '
                           'kệ, làm pallet đổ nghiêng sập kệ.\n'
                           '- **💡 Lời khuyên từ Tùng**: Đảm bảo pallet được đặt cân đối và chắc chắn trên thanh sắt đỡ '
                           'của kệ trước khi rút hẳn càng nâng xe ra.',
                        6: '**Bước 6: Tắt máy, hạ càng, kéo phanh tay & Đỗ xe đúng nơi quy định**\n'
                           '\n'
                           '- **Mục tiêu**: Đỗ xe an toàn tránh cản trở và tránh người lạ tự ý vận hành.\n'
                           '- **Nghiệp vụ chi tiết**:\n'
                           '  - Hạ càng nâng sát xuống mặt đất, cài phanh tay chắc chắn.\n'
                           '  - Tắt động cơ xe nâng, rút chìa khóa mang theo hoặc bàn giao cho thủ kho giữ khóa.\n'
                           '  - Đỗ xe nâng đúng vị trí kẻ vạch đỗ quy định, không đỗ cản lối thoát hiểm.\n'
                           '- **⚠️ Lỗi thường gặp**: Đỗ xe nâng chắn ngay cửa thoát hiểm EXIT, khi xảy ra sự cố hỏa '
                           'hoạn cản trở lối chạy sơ tán của mọi người.\n'
                           '- **💡 Lời khuyên từ Tùng**: Nhớ rút chìa khóa mang theo để tránh người lạ hoặc khách tham '
                           'quan tự ý leo lên vận hành xe nâng nhé.'},
 'cold-storage': {1: '**Bước 1: Trang bị quần áo bảo hộ giữ ấm bắt buộc**\n'
                     '\n'
                     '- **Mục tiêu**: Bảo vệ sức khỏe nhân viên kho trước sốc nhiệt khi thay đổi môi trường đột ngột.\n'
                     '- **Nghiệp vụ chi tiết**:\n'
                     '  - Mặc áo khoác phao ấm dày chuyên dụng cho kho lạnh.\n'
                     '  - Đeo găng tay giữ ấm chống nước và đi giày bảo hộ mũi sắt có đế cao su chống trượt tốt.\n'
                     '- **⚠️ Lỗi thường gặp**: Chủ quan nghĩ chỉ vào kho lạnh lấy đồ 2 phút nên lười mặc áo khoác giữ '
                     'ấm, gây lạnh đột ngột hoặc sốc nhiệt.\n'
                     '- **💡 Lời khuyên từ Tùng**: Đừng vì lười mà không mặc đồ ấm, nhiệt độ kho đông rất lạnh dễ gây '
                     'cóng tay chân hoặc viêm phổi nếu không bảo hộ tốt.',
                  2: '**Bước 2: Kiểm tra nhiệt độ cài đặt của kho lạnh bên ngoài cửa**\n'
                     '\n'
                     '- **Mục tiêu**: Đảm bảo hệ thống lạnh hoạt động đúng dải nhiệt độ bảo quản sản phẩm.\n'
                     '- **Nghiệp vụ chi tiết**:\n'
                     '  - Đọc chỉ số nhiệt kế hiển thị trên bảng điện tử bên ngoài cửa kho.\n'
                     '  - Đối chiếu đúng chuẩn nhiệt độ:\n'
                     '    - **Kho mát**: 2 đến 8 độ C (rau củ, trái cây).\n'
                     '    - **Kho lạnh**: -2 đến 2 độ C (thịt, hải sản tươi).\n'
                     '    - **Kho đông**: -18 đến -25 độ C (hàng đông lạnh dài ngày).\n'
                     '- **⚠️ Lỗi thường gặp**: Bỏ qua bảng nhiệt kế, không phát hiện máy lạnh hỏng khiến nhiệt độ tăng '
                     'cao làm hỏng hàng loạt thực phẩm bảo quản.\n'
                     '- **💡 Lời khuyên từ Tùng**: Nếu thấy nhiệt độ thực tế cao hơn tiêu chuẩn cho phép, báo ngay cho '
                     'kỹ thuật điện lạnh của kho xử lý gấp.',
                  3: '**Bước 3: Xếp dỡ hàng hóa đúng khoảng cách (cách tường 10cm, cách sàn 15cm)**\n'
                     '\n'
                     '- **Mục tiêu**: Đảm bảo luồng khí lạnh tuần hoàn đều xung quanh pallet sản phẩm.\n'
                     '- **Nghiệp vụ chi tiết**:\n'
                     '  - Đóng cửa kho ngay sau khi xe đẩy hoặc người đi qua rèm nhựa ngăn nhiệt.\n'
                     '  - Khi xếp hàng lên kệ trong kho lạnh, bắt buộc xếp **cách tường tối thiểu 10cm** và **cách sàn '
                     'kho ít nhất 15cm**.\n'
                     '  - Không xếp hàng che chắn các họng gió thổi của dàn lạnh.\n'
                     '- **⚠️ Lỗi thường gặp**: Xếp hàng chất đống sát tường kho che kín dàn lạnh khiến góc kho bị đọng '
                     'sương chảy nước và hàng không đủ lạnh.\n'
                     '- **💡 Lời khuyên từ Tùng**: Khí lạnh cần lưu thông tự do quanh pallet, tuân thủ khoảng cách xếp '
                     'hàng giúp bảo quản sản phẩm tối ưu.',
                  4: '**Bước 4: Kiểm tra và ghi nhận nhiệt độ định kỳ 2 giờ một lần**\n'
                     '\n'
                     '- **Mục tiêu**: Ghi nhận bằng nhật ký lịch sử nhiệt độ phục vụ đối soát chất lượng.\n'
                     '- **Nghiệp vụ chi tiết**:\n'
                     '  - Cứ mỗi **2 giờ một lần**, thủ kho trực ca phải kiểm tra nhiệt kế của kho lạnh.\n'
                     '  - Ghi nhận số liệu thực tế vào Biểu mẫu theo dõi nhiệt độ treo trước cửa kho trực tiếp.\n'
                     '- **⚠️ Lỗi thường gặp**: Ghi khống số liệu nhiệt độ vào cuối ngày mà không đi kiểm tra thực tế '
                     'định kỳ 2 giờ/lần.\n'
                     '- **💡 Lời khuyên từ Tùng**: Nhật ký ghi nhiệt độ là tài liệu quan trọng đối chiếu chéo khi có lô '
                     'hàng thực phẩm bị lỗi chất lượng bảo quản.',
                  5: '**Bước 5: Giới hạn thời gian làm việc liên tục trong kho đông (tối đa 30 phút)**\n'
                     '\n'
                     '- **Mục tiêu**: Bảo vệ an toàn sinh lý cơ thể nhân viên kho trong môi trường dưới âm độ.\n'
                     '- **Nghiệp vụ chi tiết**:\n'
                     '  - Giới hạn thời gian làm việc liên tục trong kho đông lạnh (-18 độ C) tối đa là **30 phút**.\n'
                     '  - Sau 30 phút, bắt buộc phải di chuyển ra phòng đệm sưởi ấm cơ thể ít nhất 10 phút trước khi '
                     'vào lại.\n'
                     '- **⚠️ Lỗi thường gặp**: Cố đứng kiểm kê nốt kệ hàng trong kho đông hơn 1 tiếng, dẫn đến tê lạnh '
                     'chân tay khó di chuyển.\n'
                     '- **💡 Lời khuyên từ Tùng**: Hãy cài báo thức trên điện thoại để nhắc nhở bản thân ra ngoài sưởi '
                     'ấm đúng giờ để bảo vệ sức khỏe nhé.'},
 'order-reconciliation': {1: '**Bước 1: Xuất báo cáo xuất/nhập trong ngày từ hệ thống WMS**\n'
                             '\n'
                             '- **Mục tiêu**: Có số liệu gốc của hệ thống để đối chiếu so sánh chênh lệch.\n'
                             '- **Nghiệp vụ chi tiết**:\n'
                             '  - Vào cuối ca trực, đăng nhập tài khoản của cậu vào hệ thống WMS.\n'
                             "  - Xuất báo cáo **'Danh sách đơn xuất kho trong ngày'** và **'Danh sách đơn nhập kho "
                             "trong ngày'** ra file Excel.\n"
                             '- **⚠️ Lỗi thường gặp**: Xuất sai khung giờ làm việc của ca trực hoặc xuất nhầm dữ liệu '
                             'của ngày hôm trước.\n'
                             '- **💡 Lời khuyên từ Tùng**: Luôn kiểm tra kỹ bộ lọc thời gian và mã ca trực khi bấm nút '
                             'xuất file báo cáo từ hệ thống WMS.',
                          2: '**Bước 2: Thu thập đầy đủ chứng từ giao nhận giấy có chữ ký bưu tá**\n'
                             '\n'
                             '- **Mục tiêu**: Thu thập đầy đủ chứng từ chứng minh hàng đã thực tế giao nhận.\n'
                             '- **Nghiệp vụ chi tiết**:\n'
                             '  - Gom toàn bộ Phiếu giao nhận hàng nhập kho và Phiếu xuất kho (Shipping Manifests) '
                             'giấy.\n'
                             '  - Đảm bảo các phiếu giấy thu thập được đều có đầy đủ chữ ký tươi xác nhận của tài '
                             'xế/bưu tá.\n'
                             '- **⚠️ Lỗi thường gặp**: Làm thất lạc phiếu giấy hoặc nhận phiếu không có chữ ký của bưu '
                             'tá vận chuyển, mất căn cứ đối soát.\n'
                             '- **💡 Lời khuyên từ Tùng**: Hãy kẹp toàn bộ phiếu giao nhận giấy vào một bảng nhựa đặt '
                             'tại bàn làm việc ngay khi bưu tá ký xong.',
                          3: '**Bước 3: Đối chiếu so khớp chênh lệch số lượng từng đơn hàng**\n'
                             '\n'
                             '- **Mục tiêu**: So khớp chênh lệch số lượng từng đơn hàng giữa phần mềm và thực tế '
                             'giấy.\n'
                             '- **Nghiệp vụ chi tiết**:\n'
                             '  - So sánh chi tiết từng mã đơn hàng (Order ID) trên báo cáo Excel WMS với phiếu giấy '
                             'thực tế.\n'
                             '  - Kiểm tra xem số lượng hàng xuất đi có khớp với số lượng quét mã vạch không.\n'
                             '  - Kiểm tra xem chữ ký của bưu tá có bị thiếu ở đơn nào không.\n'
                             '- **⚠️ Lỗi thường gặp**: Đối soát lướt nhanh bỏ qua các đơn nhỏ lẻ, tích tụ lâu ngày '
                             'thành thất thoát tồn kho lớn không rõ nguyên nhân.\n'
                             '- **💡 Lời khuyên từ Tùng**: Dò chi tiết từng dòng một. Đơn nào khớp 100% thì đánh dấu '
                             'tick xanh bên cạnh dòng đó trên báo cáo.',
                          4: '**Bước 4: Xử lý chênh lệch & Rà soát camera an ninh**\n'
                             '\n'
                             '- **Mục tiêu**: Xác định vị trí thực tế của thùng hàng bị lệch để quy trách nhiệm.\n'
                             '- **Nghiệp vụ chi tiết**:\n'
                             '  - Nếu phát hiện đơn bị lệch số lượng: khoanh tròn bút dạ vàng. Hỏi lại nhân viên đóng '
                             'đơn hàng đó.\n'
                             '  - Rà soát camera an ninh tại khu vực bàn giao/bàn đóng gói theo khung giờ quét đơn '
                             'trên hệ thống.\n'
                             '- **⚠️ Lỗi thường gặp**: Thấy lệch số liệu tặc lý bỏ qua mà không đi kiểm đếm kệ thực tế '
                             'xem có bị thừa ra 1 sản phẩm không.\n'
                             '- **💡 Lời khuyên từ Tùng**: Rà soát camera là cách nhanh nhất để biết bưu tá có vô tình '
                             'bỏ quên thùng hàng trên xe đẩy hay không.',
                          5: '**Bước 5: Lập báo cáo chênh lệch đối soát nộp quản lý**\n'
                             '\n'
                             '- **Mục tiêu**: Ghi nhận chênh lệch số liệu trình duyệt cấp trên phê duyệt xử lý.\n'
                             '- **Nghiệp vụ chi tiết**:\n'
                             '  - Viết Biên bản giải trình đối soát ngắn, liệt kê chi tiết các đơn bị lệch kèm nguyên '
                             'nhân nghi ngờ.\n'
                             '  - Đề xuất hướng xử lý: điều chỉnh tồn kho hệ thống hoặc yêu cầu bưu cục bồi thường.\n'
                             '- **⚠️ Lỗi thường gặp**: Chỉ lập biên bản miệng với quản lý kho mà không làm biên bản '
                             'giấy ký nhận chênh lệch lưu hồ sơ.\n'
                             '- **💡 Lời khuyên từ Tùng**: Lập biên bản chênh lệch giấy giúp phòng kế toán kho có cơ sở '
                             'pháp lý cân đối lại sổ sách tài chính tài sản.',
                          6: '**Bước 6: Trình ký duyệt quản lý & Lưu trữ hồ sơ cặp tháng**\n'
                             '\n'
                             '- **Mục tiêu**: Lưu trữ chứng từ đối soát hoàn tất phục vụ thanh tra thuế và kế toán.\n'
                             '- **Nghiệp vụ chi tiết**:\n'
                             '  - Nộp báo cáo đối soát và biên bản lệch cho Quản lý kho duyệt ký.\n'
                             '  - Kẹp toàn bộ chứng từ giấy đã đối soát khớp 100% vào cặp tài liệu lưu trữ của tháng '
                             'trực tiếp.\n'
                             '- **⚠️ Lỗi thường gặp**: Vứt phiếu giấy lộn xộn sau khi đối soát xong, khi kiểm toán kho '
                             'định kỳ hỏi tìm chứng từ gốc không tìm thấy.\n'
                             '- **💡 Lời khuyên từ Tùng**: Lưu trữ chứng từ ngăn nắp theo từng tháng giúp kho mình luôn '
                             'sẵn sàng cho các đợt kiểm tra đột xuất.'},
 'pda-device': {1: '**Bước 1: Khởi động và kiểm tra đầu ca**\n'
                   '\n'
                   '- **Mục tiêu**: Đảm bảo thiết bị hoạt động tốt, đủ pin trước khi bắt đầu công việc.\n'
                   '- **Nghiệp vụ chi tiết**:\n'
                   '  - Nhận máy PDA được bàn giao từ tủ thiết bị hoặc từ ca trước.\n'
                   '  - Kiểm tra dung lượng pin trên màn hình (đảm bảo pin >80% để làm việc cả ca, nếu pin yếu hãy đổi '
                   'pin dự phòng hoặc đổi máy).\n'
                   '  - Kiểm tra mắt quét laser xem có sạch không, nếu mờ bụi hãy lau nhẹ bằng khăn mềm.\n'
                   '- **⚠️ Lỗi thường gặp**: Mang máy pin yếu vào kho sâu làm việc, máy hết pin giữa chừng phải đi sạc '
                   'làm gián đoạn tiến độ công việc.\n'
                   '- **💡 Lời khuyên từ Tùng**: Luôn dành ra 1-2 phút đầu ca check pin và mắt đọc để tránh phiền phức '
                   'trong lúc làm việc nhé.',
                2: '**Bước 2: Đăng nhập hệ thống quản lý WMS**\n'
                   '\n'
                   '- **Mục tiêu**: Xác thực tài khoản cá nhân và đồng bộ dữ liệu ca trực.\n'
                   '- **Nghiệp vụ chi tiết**:\n'
                   '  - Bật kết nối Wi-Fi của máy và mở ứng dụng quản lý kho WMS.\n'
                   '  - Đăng nhập bằng tài khoản cá nhân được cấp. Kiểm tra ca làm việc và phân khu làm việc được chỉ '
                   'định trên phần mềm.\n'
                   '- **⚠️ Lỗi thường gặp**: Dùng chung tài khoản của người khác đăng nhập, dẫn đến khi xảy ra sai '
                   'lệch số liệu không thể quy trách nhiệm chính xác.\n'
                   '- **💡 Lời khuyên từ Tùng**: Tuyệt đối không chia sẻ mật khẩu tài khoản WMS cá nhân cho người khác '
                   'để tự bảo vệ mình nha.',
                3: '**Bước 3: Thực hiện quét mã sản phẩm và vị trí kệ**\n'
                   '\n'
                   '- **Mục tiêu**: Nhập/xuất/kiểm kê chính xác hàng hóa lên hệ thống.\n'
                   '- **Nghiệp vụ chi tiết**:\n'
                   '  - Khi quét mã sản phẩm hoặc mã kệ, chĩa mắt quét laser vào mã vạch ở khoảng cách 15-25 cm.\n'
                   '  - Nhấn giữ nút quét (nút màu cam ở hai bên sườn máy hoặc nút bấm cò súng).\n'
                   "  - Đợi máy phát tiếng kêu 'Tít' và màn hình hiển thị viền xanh lá (hoặc thông báo thành công).\n"
                   '- **⚠️ Lỗi thường gặp**: Quét mã vạch quá gần hoặc quá xa khiến máy không thể nhận diện được mã.\n'
                   '- **💡 Lời khuyên từ Tùng**: Giữ góc quét chéo khoảng 30-45 độ so với bề mặt mã vạch thay vì chiếu '
                   'thẳng góc 90 độ, tia laser sẽ phản xạ tốt hơn đó.',
                4: '**Bước 4: Xử lý khi gặp mã vạch lỗi hoặc mất kết nối**\n'
                   '\n'
                   '- **Mục tiêu**: Đảm bảo công việc liên tục ngay cả khi thiết bị gặp sự cố kỹ thuật.\n'
                   '- **Nghiệp vụ chi tiết**:\n'
                   "  - Nếu mã vạch bị rách, xước không quét được, chọn tính năng 'Nhập tay' trên ứng dụng WMS và gõ "
                   'dãy ký tự SKU/mã vạch ghi dưới tem.\n'
                   '  - Nếu PDA báo mất mạng (Offline), di chuyển ra khu vực thông thoáng gần bộ phát Wi-Fi để dữ liệu '
                   'được đồng bộ ngay lập tức.\n'
                   '- **⚠️ Lỗi thường gặp**: Mã vạch bị hỏng nhưng vẫn cố quét đi quét lại nhiều lần gây mất thời '
                   'gian, hoặc tự ý bỏ qua sản phẩm đó không quét.\n'
                   '- **💡 Lời khuyên từ Tùng**: Nếu gặp lỗi mạng, đừng tắt máy đột ngột vì có thể làm mất dữ liệu quét '
                   'dở dang chưa đồng bộ về máy chủ.',
                5: '**Bước 5: Đăng xuất và bàn giao sạc cuối ca**\n'
                   '\n'
                   '- **Mục tiêu**: Bảo mật thông tin tài khoản và sạc đầy thiết bị cho ca sau.\n'
                   '- **Nghiệp vụ chi tiết**:\n'
                   '  - Đăng xuất tài khoản khỏi phần mềm WMS để bảo mật.\n'
                   '  - Lau sạch bụi bẩn trên thân máy PDA và cắm trả máy vào đế sạc (Cradle) đúng khớp sạc.\n'
                   '- **⚠️ Lỗi thường gặp**: Quên đăng xuất tài khoản WMS khi ra về, hoặc cắm sạc lệch khớp khiến máy '
                   'ca sau không có pin để dùng.\n'
                   '- **💡 Lời khuyên từ Tùng**: Hãy kiểm tra xem đèn LED báo sạc trên máy PDA đã chuyển sang màu '
                   'đỏ/cam báo sạc trước khi ra về nhé.'}}
