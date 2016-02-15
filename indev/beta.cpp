void CPlayer::pc_UpgradeItem(_STORAGE_POS_INDIV* pposTalik, _STORAGE_POS_INDIV* pposToolItem, _STORAGE_POS_INDIV* pposUpgItem, BYTE byJewelNum, _STORAGE_POS_INDIV* pposUpgJewel)
{
	BYTE byErrCode = 0;//1;//¾ø´Â¾ÆÀÌÅÛ 2;//¾÷±Û¸¸¶¥ÇßÀ½ 3;//¾÷±Û¾ÈµÅ´Â ¾ÆÀÌÅÛ 5;//´õÀÌ»óÇØ´çÅ»¸¯À»Ãß°¡ÇÒ¼ö¾øÀ½ 6;//ÀÌ¾ÆÀÌÅÛ¿¡´ÂÇØ´çÅ»¸¯À»Ãß°¡ÇÒ¼ö¾øÀ½ 7;//ÀÌ¹Ì ³»¼ºÅ»¸¯ÀÌ ¹ÚÈù ¾ÆÀÌÅÛ 100;//·£´ý½ÇÆÐ, 101;//±âÁ¸Å»¸¯ÆÄ±« 102;	//¾ÆÀÌÅÛºÐ½Ç..
	int i;
	_STORAGE_LIST* pList = m_Param.m_pStoragePtr[pposUpgItem->byStorageCode];
	__ITEM* pTalikProp = NULL;
	__ITEM* pToolProp = NULL;
	__ITEM* pDstItemProp = NULL;
	__ITEM* pJewelProp[upgrade_jewel_num];
	_ItemUpgrade_fld* pTalik = NULL;
	_ItemUpgrade_fld* pJewelFld[upgrade_jewel_num];
	memset(pJewelFld, NULL, sizeof(_ItemUpgrade_fld*)*upgrade_jewel_num);

	//´ë»ó¾ÆÀÌÅÛ¼ÒÁöÈ®ÀÎ
	pDstItemProp = pList->GetPtrFromSerial(pposUpgItem->wItemSerial);
	

	if(byErrCode == 0)
	{
		__ITEM ItemCopy;
		__ITEM TalikCopy;
		__ITEM JewelCopy[upgrade_jewel_num];

		//ÀÏ´ÜÄ«ÇÇ..
		memcpy(&ItemCopy, pDstItemProp, sizeof(__ITEM));
		memcpy(&TalikCopy, pTalikProp, sizeof(__ITEM));

		for(i = 0; i < byJewelNum; i++){
			memcpy(&JewelCopy[i], pJewelProp[i], sizeof(__ITEM));
		}

		//Å»¸¯ º¸¼® »èÁ¦
		Emb_AlterDurPoint(_STORAGE_POS::INVEN, pTalikProp->m_byStorageIndex, -1, true);//¾÷±Û
		for(i = 0; i < byJewelNum; i++)			
			Emb_AlterDurPoint(_STORAGE_POS::INVEN, pJewelProp[i]->m_byStorageIndex, -1, true);//¾÷±Û
	
		//¾÷±Û¿¬Àå³»±¸¼º¼Ò¸ð
		__ITEM* pToolCon = &m_Param.m_pStoragePtr[_STORAGE_POS::INVEN]->m_pStorageList[pToolProp->m_byStorageIndex];
		DWORD dwLeftToolDur = Emb_AlterDurPoint(_STORAGE_POS::INVEN, pToolProp->m_byStorageIndex, -1, false);//¼Ò¸ð
		if(dwLeftToolDur == 0)
		{	//ITEM HISTORY..
			s_MgrItemHistory.consume_del_item(pToolCon, m_szItemHistoryFileName);
		}

		//¾Æ¾ÆÅÛ¾÷±Û
		float fRate = 0.0f;
		for(i = 0; i < upgrade_jewel_num; i++)
		{
			if(!pJewelFld[i])
				fRate += 0.125;
			else
				fRate += pJewelFld[i]->m_fJewelFieldValue;
		}

		BYTE byLv = ::GetItemUpgedLv(pDstItemProp->m_dwLv);

		DWORD dwTotalRate = (s_dwItemUpgSucRate[byLv]*fRate/upgrade_jewel_num)*1000;

		DWORD dwR1 = ::rand();
		DWORD dwRand = (dwR1<<16)+::rand();

		if(m_bCheat_100SuccMake)//100%¼º°øÄ¡Æ®..
			dwTotalRate = 0xFFFFFFFF;
		
		if(dwTotalRate <= dwRand%100 000)//½ÇÆÐ½Ã..
		{
			byErrCode = miss_upgrade_random;//·£´ý½ÇÆÐ

			//±âÁ¸Å»¸¯ºÐ½Ç..
			bool bTalikBreak = false;
			switch(byLv)
			{
			case 5:
				if(125 > ::rand()%1000)
					bTalikBreak = true;
				break;
			case 6:
				if(250 > ::rand()%1000)
					bTalikBreak = true;
				break;
			case 7:
				if(500 > ::rand()%1000)
					bTalikBreak = true;
				break;
			}                         
			if(bTalikBreak)//¸ðµçÅ»¸¯ÀÌ ÆÄ±«µÅ¾î ¾÷±×·¹ÀÌµå°¡ 0ÀÌµÈ´Ù
			{                          
				Emb_ItemUpgrade(item_upgrade_init, pposUpgItem->byStorageCode, pDstItemProp->m_byStorageIndex, 0);
									   	
				byErrCode = miss_upgrade_destroy_talik;	 //·¹º§ 0À¸·Î..101;//±âÁ¸Å»¸¯ÆÄ±«
			}
			else
			{
				//¾ÆÀÌÅÛºÐ½Ç..
				bool bItemBreak = false;
				switch(byLv)
				{
				case 5:
					if(125 > ::rand()%1000)
						bItemBreak = true;
					break;
				case 6:
					if(250 > ::rand()%1000)
						bItemBreak = true;
					break;
				case 7:
					if(500 > ::rand()%1000)
						bItemBreak = true;
					break;
				}

				if(bItemBreak)
				{
					Emb_DelStorage(pList->m_nListCode, pDstItemProp->m_byStorageIndex, false);
					byErrCode = miss_upgrade_destroy_item;	//¾ÆÀÌÅÛºÐ½Ç..
				}
			}
		}
		else
		{
			//¾÷±Û¼º°ø
			DWORD dwUpt = ::GetBitAfterUpgrade(pDstItemProp->m_dwLv, pTalik->m_dwIndex, byLv);
			Emb_ItemUpgrade(item_upgrade_up, pList->m_nListCode, pDstItemProp->m_byStorageIndex, dwUpt);
		}

		//ITEM HISTORY..
		s_MgrItemHistory.grade_up_item(&ItemCopy, &TalikCopy, JewelCopy, byJewelNum, byErrCode, pDstItemProp->m_dwLv, m_szItemHistoryFileName);
	}

	SendMsg_ItemUpgrade(byErrCode);
}
